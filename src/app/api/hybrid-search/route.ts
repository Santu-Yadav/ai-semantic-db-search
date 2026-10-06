import { hybridSearch } from "@/lib/hybrid-search";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const results = await hybridSearch(query);

    return Response.json({
      query,
      results,
    });
  } catch (error) {
    console.error("Hybrid search error:", error);

    return Response.json({ error: "Hybrid search failed" }, { status: 500 });
  }
}
