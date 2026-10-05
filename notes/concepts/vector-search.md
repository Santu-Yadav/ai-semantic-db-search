# Vector Search

## What does it do?

Vector search finds the pieces of stored knowledge that are
semantically closest to a user's question.

## What happens?

User query
→ Gemini converts query into an embedding
→ pgvector compares it with stored chunk embeddings
→ calculates distance
→ sorts by closest distance
→ returns the most relevant chunks

## What does it NOT do?

Vector search does NOT generate the final answer.

It only retrieves relevant information.

## In our project

File:

src/app/api/vector-search/route.ts

Its job is:

Query → Embedding → pgvector → Relevant chunks

## Important

pgvector calculates the distance.

Gemini generates the embeddings.

Vector search = retrieval only.
