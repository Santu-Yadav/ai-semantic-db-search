import SearchBar from "@/components/search/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Search</h1>

        <SearchBar />
      </div>
    </main>
  );
}
