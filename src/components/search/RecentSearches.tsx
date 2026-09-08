type RecentSearchesProps = {
  searches: string[];
  onSelect: (query: string) => void;
};

export default function RecentSearches({
  searches,
  onSelect,
}: RecentSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
      <p className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500">
        Recent searches
      </p>

      <ul>
        {searches.map((search) => (
          <li key={search}>
            <button
              type="button"
              onClick={() => onSelect(search)}
              className="w-full rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              🕘 {search}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
