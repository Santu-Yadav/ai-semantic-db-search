import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const searchQuery = body.query;

  if (!searchQuery?.trim()) {
    return Response.json({ error: "Query is required." }, { status: 400 });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: searchQuery,
  });

  return Response.json({
    answer: response.text,
  });
}
