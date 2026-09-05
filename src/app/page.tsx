export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Search</h1>

        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Search..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />

          <button
            type="button"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Search
          </button>
        </div>
      </div>
    </main>
  );
}
