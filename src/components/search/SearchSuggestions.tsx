import { SearchItem } from "@/types/search";

type SearchSuggestionsProps = {
  suggestions: SearchItem[];
  onSelect: (query: string) => void;
};

export default function SearchSuggestions({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
      <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
        Suggestions
      </p>

      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          type="button"
          onClick={() => onSelect(suggestion.title)}
          className="block w-full rounded-md px-3 py-2 text-left hover:bg-gray-100"
        >
          <p className="text-sm font-medium text-gray-900">
            {suggestion.title}
          </p>

          <p className="text-xs text-gray-500">{suggestion.category}</p>
        </button>
      ))}
    </div>
  );
}
