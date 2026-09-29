import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Generate embedding for the user's query
    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: query,
      config: {
        taskType: "SEMANTIC_SIMILARITY",
      },
    });

    const queryEmbedding = embeddingResponse.embeddings?.[0]?.values;

    if (!queryEmbedding || queryEmbedding.length !== 3072) {
      return Response.json(
        { error: "Failed to generate query embedding" },
        { status: 500 },
      );
    }

    const vector = `[${queryEmbedding.join(",")}]`;

    // 2. Retrieve the most relevant chunks
    const chunks = await prisma.$queryRaw<
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

    // 3. Build context from retrieved chunks
    const context = chunks.map((chunk) => chunk.content).join("\n\n");

    // 4. Ask Gemini to answer using the retrieved context
    const prompt = `
You are answering a user's question using the provided context.

Context:
${context}

Question:
${query}

Instructions:
- Answer the question using the context.
- Do not invent information that is not supported by the context.
- If the context does not contain enough information, say that you do not have enough information.
`;

    const generationResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer = generationResponse.text ?? "";

    return Response.json({
      query,
      answer,
      sources: chunks,
    });
  } catch (error) {
    console.error("RAG search error:", error);

    return Response.json(
      {
        error: "RAG search failed",
      },
      { status: 500 },
    );
  }
}
