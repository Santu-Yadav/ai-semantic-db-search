import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  const { texts } = await request.json();

  if (!Array.isArray(texts) || texts.length === 0) {
    return Response.json({ error: "Texts are required" }, { status: 400 });
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: texts,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });

  const embeddings = (response.embeddings ?? []).map(
    (embedding) => embedding.values ?? [],
  );

  console.log("Number of embeddings:", embeddings.length);
  console.log("Dimensions:", embeddings[0]?.length);

  return Response.json({
    embeddings,
  });
}
