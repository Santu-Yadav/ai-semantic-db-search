"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) return;

    console.log("Searching for:", query);
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
        onChange={(event) => setQuery(event.target.value)}
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
