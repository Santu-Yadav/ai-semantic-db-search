"use client";

import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  onQueryChange: (query: string) => void;
};

export default function SearchBar({ onSearch, onQueryChange }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    onSearch(trimmedQuery);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => {
          const value = event.target.value;

          setQuery(value);
          onQueryChange(value);
        }}
        placeholder="Search..."
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
}
