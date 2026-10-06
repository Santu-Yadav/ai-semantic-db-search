import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const RRF_K = 60;
const TOP_K = 5;

export async function hybridSearch(query: string) {
  // 1. Generate query embedding
  const embeddingResponse = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });

  const queryEmbedding = embeddingResponse.embeddings?.[0]?.values;

  if (!queryEmbedding || queryEmbedding.length !== 3072) {
    throw new Error("Failed to generate query embedding");
  }

  const vector = `[${queryEmbedding.join(",")}]`;

  // 2. Run vector and keyword searches in parallel
  const [vectorResults, keywordResults] = await Promise.all([
    prisma.$queryRaw<
      {
        id: string;
        content: string;
        chunkIndex: number;
        documentId: string;
        distance: number;
      }[]
    >`
      SELECT
        "id",
        "content",
        "chunkIndex",
        "documentId",
        "embedding" <=> ${vector}::vector AS distance
      FROM "Chunk"
      WHERE "embedding" IS NOT NULL
      ORDER BY "embedding" <=> ${vector}::vector
      LIMIT ${TOP_K}
    `,

    prisma.$queryRaw<
      {
        id: string;
        content: string;
        chunkIndex: number;
        documentId: string;
        rank: number;
      }[]
    >`
      SELECT
        "id",
        "content",
        "chunkIndex",
        "documentId",
        ts_rank(
          to_tsvector('english', "content"),
          plainto_tsquery('english', ${query})
        ) AS rank
      FROM "Chunk"
      WHERE
        to_tsvector('english', "content")
        @@ plainto_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${TOP_K}
    `,
  ]);

  // 3. Combine results using RRF
  const results = new Map<
    string,
    {
      id: string;
      content: string;
      chunkIndex: number;
      documentId: string;
      rrfScore: number;
      vectorRank?: number;
      keywordRank?: number;
      distance?: number;
      keywordScore?: number;
    }
  >();

  vectorResults.forEach((result, index) => {
    const rank = index + 1;

    results.set(result.id, {
      id: result.id,
      content: result.content,
      chunkIndex: result.chunkIndex,
      documentId: result.documentId,
      rrfScore: 1 / (RRF_K + rank),
      vectorRank: rank,
      distance: result.distance,
    });
  });

  keywordResults.forEach((result, index) => {
    const rank = index + 1;
    const existing = results.get(result.id);

    const keywordContribution = 1 / (RRF_K + rank);

    if (existing) {
      existing.rrfScore += keywordContribution;
      existing.keywordRank = rank;
      existing.keywordScore = result.rank;
    } else {
      results.set(result.id, {
        id: result.id,
        content: result.content,
        chunkIndex: result.chunkIndex,
        documentId: result.documentId,
        rrfScore: keywordContribution,
        keywordRank: rank,
        keywordScore: result.rank,
      });
    }
  });

  // 4. Sort by combined RRF score
  return Array.from(results.values())
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .slice(0, TOP_K);
}
