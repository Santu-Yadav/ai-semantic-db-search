import { searchData } from "@/data/search-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return Response.json({
      results: [],
      suggestions: [],
    });
  }

  const normalizedQuery = query.toLowerCase();

  const results = searchData.filter((item) => {
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery)
    );
  });

  const suggestions = searchData
    .filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
      );
    })
    .slice(0, 5);

  return Response.json({
    results,
    suggestions,
  });
}
