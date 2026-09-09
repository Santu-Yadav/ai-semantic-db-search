"use client";

import { useState, useEffect } from "react";

import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { searchData } from "@/data/search-data";
import { SearchItem } from "@/types/search";
import RecentSearches from "@/components/search/RecentSearches";
import SearchSuggestions from "@/components/search/SearchSuggestions";

export default function Home() {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  async function handleSearch(searchQuery: string) {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      setQuery(searchQuery);
      setResults(data.results);

      setRecentSearches((previousSearches) => {
        const updatedSearches = [
          searchQuery,
          ...previousSearches.filter((search) => search !== searchQuery),
        ].slice(0, 5);

        localStorage.setItem(
          "recent-searches",
          JSON.stringify(updatedSearches),
        );

        return updatedSearches;
      });
    } catch (error) {
      console.error("Search failed:", error);
    }
  }

  function handleQueryChange(value: string) {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = value.toLowerCase();

    const filteredSuggestions = searchData
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery)
        );
      })
      .slice(0, 5);

    setSuggestions(filteredSuggestions);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();

      const selectedSuggestion = suggestions[activeSuggestionIndex];

      handleSearch(selectedSuggestion.title);

      setSuggestions([]);
      setActiveSuggestionIndex(-1);

      return;
    }

    if (event.key === "Escape") {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);

      return;
    }

    if (suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveSuggestionIndex((previousIndex) =>
        previousIndex < suggestions.length - 1 ? previousIndex + 1 : 0,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveSuggestionIndex((previousIndex) =>
        previousIndex > 0 ? previousIndex - 1 : suggestions.length - 1,
      );
    }
  }

  function handleClear() {
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  }

  useEffect(() => {
    const storedSearches = localStorage.getItem("recent-searches");

    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Search</h1>

        <div className="relative">
          <SearchBar
            onSearch={handleSearch}
            onQueryChange={handleQueryChange}
            hasSuggestions={suggestions.length > 0}
            onKeyDown={handleKeyDown}
            onClear={handleClear}
          />

          <SearchSuggestions
            suggestions={suggestions}
            activeIndex={activeSuggestionIndex}
            onSelect={handleSearch}
          />
        </div>
        <RecentSearches searches={recentSearches} onSelect={handleSearch} />
        <SearchResults results={results} query={query} />
      </div>
    </main>
  );
}
