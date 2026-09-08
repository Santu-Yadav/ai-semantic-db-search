"use client";

import { useState } from "react";

import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { searchData } from "@/data/search-data";
import { SearchItem } from "@/types/search";

export default function Home() {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState("");

  function handleSearch(searchQuery: string) {
    const normalizedQuery = searchQuery.toLowerCase();

    const filteredResults = searchData.filter((item) => {
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
      );
    });

    setQuery(searchQuery);
    setResults(filteredResults);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Search</h1>

        <SearchBar onSearch={handleSearch} />

        <SearchResults results={results} query={query} />
      </div>
    </main>
  );
}
