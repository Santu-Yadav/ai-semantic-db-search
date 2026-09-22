import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || typeof query !== "string") {
    return Response.json(
      { error: "Query is required" },
      { status: 400 },
    );
  }

  // 1. Generate embedding for the user's query
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });

  const queryEmbedding = response.embeddings?.[0]?.values;

  if (!queryEmbedding || queryEmbedding.length !== 3072) {
    return Response.json(
      { error: "Failed to generate query embedding" },
      { status: 500 },
    );
  }

  // 2. Convert the embedding to pgvector format
  const vector = `[${queryEmbedding.join(",")}]`;

  // 3. Search for the most similar chunks
  const results = await prisma.$queryRaw<
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
    LIMIT 5
  `;

  return Response.json({
    query,
    results,
  });
}