# Chunking

## What is Chunking?

Chunking is the process of splitting a large document into
smaller pieces called chunks.

Instead of embedding an entire document as one large vector,
we create embeddings for smaller sections.

---

## Why do we need Chunking?

A user query usually relates to only a small part of a document.

For example:

Document:
React + Hooks + State + Props + Events + Rendering...

User:
"How does React state work?"

We don't want to retrieve the entire document.

Instead:

Document
↓
Chunks
↓
Embeddings
↓
Vector Search
↓
Relevant chunks

---

## What is Chunk Size?

Chunk size controls approximately how much text goes into
each chunk.

Example:

chunkSize = 500 characters

means we try to create chunks of roughly 500 characters.

### Small chunks

Pros:

- More focused information
- More precise retrieval

Cons:

- Less context

### Large chunks

Pros:

- More context
- Related information stays together

Cons:

- Retrieval can become less precise

---

## What is Chunk Overlap?

Overlap means that neighboring chunks share some content.

Example:

Chunk 1:
React state allows components to store and manage data.

Chunk 2:
manage data. React's useState Hook allows components...

The shared text provides additional context across boundaries.

---

## Why is Overlap Useful?

Important information can span across a chunk boundary.

Without overlap:

Chunk 1 → beginning of an idea
Chunk 2 → end of the idea

With overlap:

Chunk 1 → beginning + part of the idea
Chunk 2 → overlapping context + continuation

This can improve retrieval quality.

---

## Our Current Implementation

File:

src/lib/chunk-text.ts

Current approach:

Document
↓
Split into sentences
↓
Build chunks around target size
↓
Add word-safe overlap
↓
Return chunks

Example:

chunkText(text, 80, 20)

80 → approximate chunk size

20 → approximate overlap

---

## Important: Chunk Size is a Target

Our implementation does NOT guarantee exactly 80 characters.

For example:

Chunk 0 → 59 characters
Chunk 1 → 95 characters
Chunk 2 → 101 characters

This happens because we prefer keeping sentences intact
rather than cutting them in the middle.

So:

Sentence boundary > exact character limit

---

## What We Improved

### Initial approach

Fixed character slicing:

text.slice(start, end)

Problem:

"building user in"
"ng user interfaces"

Words could be split.

### Current approach

Sentence-aware chunking + word-safe overlap.

Result:

"user interfaces. React components..."

Words are no longer split by the overlap.

---

## Where Chunking Fits in RAG

Document
↓
Chunking
↓
Chunks
↓
Embeddings
↓
pgvector
↓
Vector Search
↓
Retrieved Context
↓
Gemini
↓
Answer

---

## Important Mental Model

Chunking decides:

"What pieces of knowledge should be stored and retrieved?"

Embeddings decide:

"How should each piece of knowledge be represented
semantically?"

Vector Search decides:

"Which pieces are closest to the user's question?"

RAG decides:

"How can the retrieved information be used to answer
the user's question?"
