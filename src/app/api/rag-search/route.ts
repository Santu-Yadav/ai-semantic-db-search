import { GoogleGenAI } from "@google/genai";
import { hybridSearch } from "@/lib/hybrid-search";
import { rerankChunks } from "@/lib/rerank-chunks";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }
    
    // 1. Retrieve candidate chunks using hybrid search
    const chunks = await hybridSearch(query);
   
    // 2. Re-rank candidates by relevance to the query
    const rerankedChunks = await rerankChunks(query, chunks);

    // 3. Build context from retrieved chunks
    const context = rerankedChunks.map((chunk) => chunk.content).join("\n\n");

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
      sources: rerankedChunks,
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
