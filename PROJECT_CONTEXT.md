# AI Search / RAG Project

## Architecture

```text
App

├── Search UI
│   ├── SearchBar
│   ├── SearchSuggestions
│   ├── RecentSearches
│   └── SearchResults
│
├── API
│   ├── /api/search
│   ├── /api/embedding-test
│   └── /api/ingest
│
├── Database
│   └── Prisma → Neon PostgreSQL
│
└── AI / RAG
    ├── Gemini LLM
    ├── Gemini Embeddings
    ├── Document + Chunk
    └── pgvector
```

---

# Search Flow

```text
User enters query
        ↓
SearchBar
        ↓
Search state
        ↓
/api/search
        ↓
PostgreSQL
        ↓
Search results
        ↓
SearchResults
```

---

# Current RAG Data Flow

```text
Original Document
        ↓
Split into Chunks
        ↓
Generate embedding for each Chunk
        ↓
3072-dimensional vector
        ↓
Store vector in PostgreSQL using pgvector
```

Current database relationship:

```text
Document
   │
   │ 1 → many
   ↓
Chunks
   ├── Chunk 0 → embedding
   ├── Chunk 1 → embedding
   └── Chunk 2 → embedding
```

The relationship is maintained through:

```text
Chunk.documentId → Document.id
```

The embedding belongs to the Chunk; the foreign key connects the Chunk to its parent Document.

---

# RAG Flow — Target Architecture

```text
User query
    ↓
Generate query embedding
    ↓
Vector similarity search
    ↓
Retrieve relevant chunks
    ↓
Send query + retrieved context to Gemini
    ↓
Generate grounded answer
    ↓
Display answer
```

---

# Completed

## Traditional Search

- Basic search UI
- SearchBar
- SearchResults
- SearchSuggestions
- RecentSearches
- Keyboard navigation
- Search API
- PostgreSQL-backed search

## Database

- Neon PostgreSQL setup
- Prisma setup
- Prisma migrations
- `SearchItem` model
- `Document` model
- `Chunk` model
- Document → Chunk one-to-many relationship
- Foreign key relationship using `Chunk.documentId`
- PostgreSQL `vector` extension enabled

## AI

- Gemini API integration
- Gemini AI Search response
- Gemini embedding generation
- Understanding embedding vectors
- Understanding 3072-dimensional embeddings
- Generated embeddings for multiple texts
- Implemented cosine similarity in TypeScript
- Compared semantic similarity between embeddings

## RAG Foundation

- Document stored in PostgreSQL
- Document split into chunks
- Embedding generated for every chunk
- Embeddings stored in PostgreSQL
- `Chunk.embedding` uses `vector(3072)`
- Verified that 3 chunks have stored embeddings

---

# Important Learning Concepts Completed

### Embeddings

Text is converted into a numerical vector:

```text
Text
 ↓
Embedding model
 ↓
[3072 numbers]
```

The individual numbers do not represent simple human-readable features. The complete vector represents the semantic characteristics of the text.

### Cosine Similarity

Used to measure the semantic closeness between two embedding vectors.

```text
similarity(A, B)
```

Higher similarity generally means the vectors are closer in semantic space.

### Document vs Chunk

A Document contains the original knowledge.

A Chunk contains a smaller piece of that knowledge.

```text
Document
   ↓
Chunk 0
Chunk 1
Chunk 2
...
```

Each Chunk gets its own embedding so that retrieval can find the specific relevant part of a document.

### Foreign Key

```text
Chunk.documentId
        ↓
Document.id
```

This connects every chunk to its parent document.

### pgvector

PostgreSQL's vector extension allows us to store and search embedding vectors directly inside PostgreSQL.

---

# Current Database Structure

## Document

```text
Document
├── id
├── title
├── content
└── createdAt
```

## Chunk

```text
Chunk
├── id
├── content
├── chunkIndex
├── documentId
└── embedding → vector(3072)
```

Relationship:

```text
Document 1 ───────── * Chunk
```

---

# Current API

## `/api/search`

Traditional PostgreSQL search.

```text
Query
 ↓
PostgreSQL
 ↓
Search results
```

## `/api/embedding-test`

Used for learning/testing Gemini embeddings.

```text
Text
 ↓
Gemini embedding
 ↓
3072-dimensional vector
```

## `/api/ingest`

Currently performs the embedding ingestion flow:

```text
Get chunks
 ↓
Send chunk contents to Gemini
 ↓
Generate embeddings
 ↓
Store embeddings in pgvector
```

Current successful response:

```text
{
  message: "Embeddings generated and stored successfully",
  count: 3
}
```

---

# Current Work

I'm currently implementing:

- RAG retrieval
- PostgreSQL vector similarity search
- Connecting retrieved chunks to Gemini
- Grounded AI search

---

# Phase 5 Status

```text
5.1 RAG Architecture              ✅ Complete
5.2 Embeddings                    ✅ Complete
5.3 Document + Chunk Model        ✅ Complete
5.4 pgvector                      ✅ Complete
5.5 Generate Chunk Embeddings     ✅ Complete
5.6 Store Embeddings              ✅ Complete

5.7 Semantic Vector Search        ⏳ NEXT
5.8 Send Context to Gemini        ⏳ Remaining
5.9 End-to-End RAG Search         ⏳ Remaining
```

---

# NEXT STEP — 5.7 Semantic Vector Search

Implement the actual PostgreSQL vector search.

The goal is:

```text
User Query
    ↓
Generate query embedding
    ↓
Use query vector against Chunk.embedding
    ↓
Calculate vector similarity in PostgreSQL
    ↓
Order by similarity
    ↓
Retrieve top relevant chunks
```

For example:

```text
User:
"How do React components receive data?"

        ↓

Query embedding

        ↓

PostgreSQL

Chunk 0 → similarity: ...
Chunk 1 → similarity: HIGH
Chunk 2 → similarity: ...

        ↓

Retrieve Chunk 1
```

Important distinction:

We have already implemented **cosine similarity in TypeScript for learning**.

We have NOT yet implemented the actual **pgvector similarity search**.

That is the next feature.

---

# After 5.7

## 5.8 — Connect Retrieval to Gemini

Once relevant chunks are retrieved:

```text
User Query
     +
Retrieved Chunks
     ↓
Gemini
     ↓
Grounded Answer
```

Gemini should receive the retrieved knowledge as context rather than answering purely from its general knowledge.

---

# 5.9 — End-to-End RAG Search

Final Phase 5 flow:

```text
User Query
     ↓
Query Embedding
     ↓
PostgreSQL / pgvector
     ↓
Relevant Chunks
     ↓
Context
     ↓
Gemini
     ↓
Grounded Answer
     ↓
Search UI
```

After this is complete, the project will have a working basic RAG search pipeline.

---

# Important Project Notes

- Using Next.js App Router
- Using TypeScript
- Using Tailwind CSS
- Using Prisma 7
- Using Neon PostgreSQL
- Using PostgreSQL `pgvector`
- Using Gemini for LLM generation
- Using Gemini `gemini-embedding-001` for embeddings
- Current embedding dimension: **3072**
- Do not change the existing embedding dimension without updating the database/vector strategy
- Embeddings are stored using PostgreSQL `vector(3072)`
- `Document` → `Chunk` is a one-to-many relationship
- `Chunk.documentId` is the foreign key to `Document.id`
- Loading state, error UX, and other UI polish are intentionally deferred
- Core AI/RAG functionality takes priority over UX refinement

---

# Commit Milestones

Completed milestones include:

```text
feat: migrate search from mock data to PostgreSQL

feat: integrate AI-powered search with Gemini

feat: generate semantic embeddings with Gemini

feat: calculate cosine similarity for embeddings

feat: generate and store chunk embeddings in pgvector
```

Future commits should be created when each complete feature is finished, not after every small implementation step.

---

# 🚀 RESUME HERE

## Current Feature

**RAG-based AI Search**

## Last Completed

**Embedding generation and storage in PostgreSQL/pgvector**

## Current Step

**5.7 — Semantic Vector Search**

## Next Implementation

Implement PostgreSQL vector similarity search.

The next goal is:

```text
Query
 ↓
Query Embedding
 ↓
pgvector similarity search
 ↓
Top relevant chunks
```

## Do NOT work on yet

- Loading UX
- Error UX
- Accessibility refinements
- General UI polish
- Advanced RAG features

These are intentionally deferred until the core RAG pipeline is working.

## Start Here

The next implementation should focus on the vector-search API and the pgvector cosine-distance query.
