import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST() {
  const chunks = await prisma.chunk.findMany({
    orderBy: {
      chunkIndex: "asc",
    },
  });

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: chunks.map((chunk) => chunk.content),
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });

  // console.log(" response @@@@@@ :", response);

  const embeddings = (response.embeddings ?? []).map(
    (embedding) => embedding.values ?? [],
  );

  // console.log(" embeddings @@@@@@ :", embeddings);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = embeddings[i];

    if (!embedding || embedding.length !== 3072) {
      continue;
    }

    const vector = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      UPDATE "Chunk"
      SET "embedding" = ${vector}::vector
      WHERE "id" = ${chunk.id}
    `;
  }

  return Response.json({
    message: "Embeddings generated and stored successfully",
    count: embeddings.length,
  });
}
