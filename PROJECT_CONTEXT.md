## Architecture

App
├── Search UI
│ ├── SearchBar
│ ├── SearchSuggestions
│ └── SearchResults
│
├── API
│ ├── /api/search
│ ├── /api/embeddings
│ └── /api/ai-search
│
├── Database
│ └── Prisma → Neon PostgreSQL
│
└── AI/RAG
│ ├── Embeddings
| ├── Vector search
| └── LLM
|

## Search Flow

User enters query
→ SearchBar
→ search state
→ /api/search
→ PostgreSQL
→ results
→ SearchResults

## RAG Flow

User query
→ generate query embedding
→ vector similarity search
→ retrieve relevant chunks
→ send context to LLM
→ generate answer
→ display answer

## Completed

- Basic search UI
- Search suggestions
- PostgreSQL integration
- Prisma setup
- Embedding generation
- Stored embeddings in pgvector
- Cosine similarity search

## Current Work

I'm currently implementing:

- RAG retrieval
- Connecting retrieved chunks to the LLM

Last completed step:

- Vector similarity query is working.

## NEXT STEP

Implement `/api/ai-search`.

1. Receive `query`
2. Generate query embedding
3. Search `Chunk` using cosine similarity
4. Take top 5 chunks
5. Send chunks + query to Gemini
6. Return generated answer

## Important Notes

- Using Next.js App Router
- Using Prisma 7
- Database is Neon PostgreSQL
- Embedding dimension is 3072
- Embeddings are stored using pgvector
- Don't change the existing embedding dimension
- Loading/error UX is intentionally deferred

# 🚀 RESUME HERE

Last worked on: 18 Sep 2026

Current feature:
RAG-based AI search

Last completed:
Vector similarity search

Currently working on:
Connecting retrieved chunks to Gemini

NEXT:
Implement `/api/ai-search/route.ts`

Start reading:
`app/api/ai-search/route.ts`

Do NOT work on:
Loading/error UX — intentionally deferred
