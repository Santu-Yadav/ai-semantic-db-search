import { SearchItem } from "@/types/search";

type SearchResultsProps = {
  results: SearchItem[];
  query: string;
};

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="font-medium text-gray-900">No results found</p>
        <p className="mt-1 text-sm text-gray-500">
          Try searching with a different keyword.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <p className="mb-4 text-sm text-gray-500">
        {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
      </p>

      <div className="space-y-4">
        {results.map((result) => (
          <article
            key={result.id}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <div className="mb-2 text-xs font-medium uppercase text-gray-500">
              {result.category}
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              {result.title}
            </h2>

            <p className="mt-2 text-sm text-gray-600">{result.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
