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
You are a question-answering assistant. Answer the user's question
using only the information provided in the context.

Context:
<context>
${context}
</context>

Question:
<question>
${query}
</question>

Rules:
1. Use only facts explicitly supported by the context.
2. Do not use outside knowledge, assumptions, or invented details.
3. If the context fully answers the question, provide a clear and
   direct answer.
4. If the context answers only part of the question, answer that
   part and clearly state what information is missing.
5. If the context does not contain relevant information, say:
   "I don't have enough information in the provided context to
   answer this question."
6. If the context contains conflicting information, acknowledge
   the conflict instead of choosing an unsupported answer.
7. Do not claim that you verified something unless the context
   supports that claim.

Answer naturally and concisely.
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
