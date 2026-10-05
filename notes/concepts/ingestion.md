What is ingestion?
What does /api/ingest do?
Why do we need it?
What happens to each chunk?
Where are embeddings stored?
How is ingestion different from vector search?

# Ingestion

## What is Ingestion?

Ingestion is the process of taking our knowledge/data and preparing it
so that the RAG system can search it later.

In our project:

Document
→ Chunks
→ Embeddings
→ Store embeddings in PostgreSQL

---

## What does `/api/ingest` do?

`/api/ingest` takes the existing chunks from PostgreSQL and generates
an embedding for each chunk using Gemini.

Flow:

Chunks from PostgreSQL
→ Gemini `gemini-embedding-001`
→ 3072-dimensional embeddings
→ Store embeddings in `Chunk.embedding`

---

## Why do we need it?

Vector search cannot compare the user's query with normal text
directly.

Both the query and the stored knowledge need to be represented as
vectors.

So ingestion prepares the stored knowledge for vector search.

---

## What happens to each chunk?

For every chunk:

1. Read the chunk from PostgreSQL.
2. Send its text to Gemini.
3. Gemini generates a 3072-dimensional embedding.
4. Store that embedding with the chunk.

Example:

Chunk:

"React state allows components to store and manage data."

↓

Gemini embedding:

[0.012, -0.034, 0.087, ... 3072 values]

↓

Stored in:

`Chunk.embedding`

---

## Where are embeddings stored?

Embeddings are stored in PostgreSQL/Neon using the `pgvector`
extension.

Our Prisma model contains:

`embedding Unsupported("vector(3072)")?`

The actual database column uses:

`vector(3072)`

---

## How is Ingestion different from Vector Search?

### Ingestion

Prepares our stored knowledge.

`Document → Chunks → Embeddings → Database`

It happens when we add or update knowledge.

### Vector Search

Finds relevant knowledge for a user's query.

`Query → Query Embedding → pgvector → Relevant Chunks`

---

## Simple Mental Model

`/api/ingest`

= "Prepare the knowledge."

`/api/vector-search`

= "Find the relevant knowledge."

`/api/rag-search`

= "Find the relevant knowledge and use it to generate an answer."

---

## Important

`/api/ingest` does NOT generate the final AI answer.

It only generates and stores embeddings.

The actual answer generation happens later in `/api/rag-search`.
