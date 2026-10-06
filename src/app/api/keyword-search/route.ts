import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const results = await prisma.$queryRaw<
      {
        id: string;
        content: string;
        chunkIndex: number;
        documentId: string;
        rank: number;
      }[]
    >`
      SELECT
        "id",
        "content",
        "chunkIndex",
        "documentId",
        ts_rank(
          to_tsvector('english', "content"),
          plainto_tsquery('english', ${query})
        ) AS rank
      FROM "Chunk"
      WHERE
        to_tsvector('english', "content")
        @@ plainto_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT 5
    `;

    return Response.json({
      query,
      results,
    });
  } catch (error) {
    console.error("Keyword search error:", error);

    return Response.json({ error: "Keyword search failed" }, { status: 500 });
  }
}
