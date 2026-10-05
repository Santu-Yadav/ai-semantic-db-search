# RAG Search

## What does it do?

RAG search retrieves relevant information and then gives
that information to an LLM so it can generate a grounded answer.

## What happens?

User query
→ Query embedding
→ Vector search
→ Retrieve relevant chunks
→ Build context
→ Create grounded prompt
→ Gemini generates answer
→ Return answer + sources

## In our project

File:

src/app/api/rag-search/route.ts

## Important

RAG search includes vector search.

Vector search:
Retrieval only

RAG:
Retrieval + Generation
