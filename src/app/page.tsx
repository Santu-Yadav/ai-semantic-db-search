"use client";

import { useState, useEffect } from "react";

import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { SearchItem, SearchResponse } from "@/types/search";
import RecentSearches from "@/components/search/RecentSearches";
import SearchSuggestions from "@/components/search/SearchSuggestions";

type SearchMode = "traditional" | "ai";

export default function Home() {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [searchMode, setSearchMode] = useState<SearchMode>("traditional");
  const [aiAnswer, setAiAnswer] = useState("");

  async function testIngest() {
    const response = await fetch("/api/ingest", {
      method: "POST",
    });

    const data = await response.json();

    console.log("Ingest response:", data);
  }

  function cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];

      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }

  async function testEmbedding() {
    const texts = [
      "React is a JavaScript library for building user interfaces.",
      "React helps developers create reusable UI components.",
      "PostgreSQL is a relational database system.",
    ];

    const response = await fetch("/api/embedding-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texts }),
    });

    const data = await response.json();
    //*************************************************************************************/

    const embeddings = data.embeddings;

    const similarityAB = cosineSimilarity(embeddings[0], embeddings[1]);

    const similarityAC = cosineSimilarity(embeddings[0], embeddings[2]);

    const similarityBC = cosineSimilarity(embeddings[1], embeddings[2]);

    console.log("A ↔ B:", similarityAB);
    console.log("A ↔ C:", similarityAC);
    console.log("B ↔ C:", similarityBC);

    //************************************************************************************ */
    console.log("Embedding response:", data);
    console.log("Number of embeddings:", data.embeddings.length);
    console.log("Dimensions:", data.embeddings[0].length);
  }

  async function handleSearch(searchQuery: string) {
    if (searchMode === "ai") {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      console.log("AI Search Response:", data);

      setAiAnswer(data.answer);

      return;
    }

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data: SearchResponse = await response.json();

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

  async function handleQueryChange(value: string) {
    if (!value.trim()) {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(value)}`,
      );

      if (!response.ok) {
        throw new Error("Suggestion request failed");
      }

      const data: SearchResponse = await response.json();

      setSuggestions(data.suggestions);
      setActiveSuggestionIndex(-1);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
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
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setSearchMode("traditional")}
          className={`rounded-md px-4 py-2 ${
            searchMode === "traditional"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Traditional
        </button>

        <button
          type="button"
          onClick={() => setSearchMode("ai")}
          className={`rounded-md px-4 py-2 ${
            searchMode === "ai"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          AI Search
        </button>
      </div>
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
        <SearchResults results={results} query={query} aiAnswer={aiAnswer} />

        <button
          type="button"
          onClick={testEmbedding}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Test Embedding
        </button>

        <button
          type="button"
          onClick={testIngest}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Test Ingest
        </button>
      </div>
    </main>
  );
}
