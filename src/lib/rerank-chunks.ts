
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type Chunk = {
  id: string;
  content: string;
  chunkIndex: number;
  documentId: string;
  rrfScore: number;
  vectorRank?: number;
  keywordRank?: number;
  distance?: number;
  keywordScore?: number;
};

export async function rerankChunks(
  query: string,
  chunks: Chunk[],
): Promise<Chunk[]> {
  if (chunks.length < 2) {
    return chunks;
  }

  const prompt = `
Rank these text chunks by how relevant they are to the user's query.

Query:
${query}

Chunks:
${JSON.stringify(
  chunks.map(({ id, content }) => ({ id, content })),
)}

Return the chunk IDs from most relevant to least relevant.
Include every provided ID exactly once. Do not invent IDs.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
      },
    });

    const rankedIds: unknown = JSON.parse(response.text ?? "null");


 console.log("Gemini ranking succeeded:", rankedIds);
    if (
      !Array.isArray(rankedIds) ||
      rankedIds.length !== chunks.length ||
      !rankedIds.every((id) => typeof id === "string") ||
      new Set(rankedIds).size !== chunks.length ||
      !chunks.every((chunk) => rankedIds.includes(chunk.id))
    ) {
      return chunks;
    }

    const chunksById = new Map(chunks.map((chunk) => [chunk.id, chunk]));

    return rankedIds.map((id) => chunksById.get(id)!);
  } catch (error) {
    console.error("Chunk re-ranking failed:", error);
    return chunks;
  }
}
