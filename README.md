This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
 pnpm dev

####################################################################################################################################
AI Vectors and Cosine Similarity Guide

Comprehensive Guide: Vectors, Embeddings, and Cosine Similarity in AI
1. What is a Vector?
In mathematics and programming, a vector is simply an ordered list of numbers.

• While a 2D vector looks like `[x, y]` representing an arrow with a horizontal and vertical reach, a high-dimensional vector in AI is an array containing thousands of numbers.

• It represents data (such as words, sentences, or images) mapped into a mathematical space where position encodes meaning.


2. Why Do We Use Vectors in AI?
Computers cannot natively understand human language ("words", "emotions", or "intent"). They only understand numbers and math.

• By converting text into vectors, we translate qualitative concepts into quantitative coordinates.

• This allows computers to perform mathematical operations—like measuring distances or angles—to reason about semantic relationships, power search engines, and drive RAG (Retrieval-Augmented Generation) systems.

3. What is a 3072-Dimension Space?
When an embedding model (like OpenAI's `text-embedding-3-large`) converts a text statement into numbers, it outputs an array of 3072 elements.

• What a dimension is: Think of each dimension as a specific, abstract "concept axis" or feature learned by the model (e.g., formality, technical depth, sentiment, topic category).

• The 3072-D Space: Just as 2 numbers define a 2D plane ($X$ and $Y$) and 3 numbers define 3D physical space, 3072 numbers define a massive 3072-dimensional space. Human brains cannot visualize past 3D, but the geometry and algebra work identically. Texts with similar meanings are mapped close together in this space.

4. What Other Dimensions Are Available?
Different embedding models use different dimensionalities depending on the use case:

• Smaller Dimensions (e.g., 384 or 768): Used by smaller, faster open-source models (like BERT-based variants or `text-embedding-3-small` configured lower). They save storage and compute power, but capture less nuanced detail.

• Standard/Large Dimensions (e.g., 1536 or 3072): Used by advanced commercial models to capture highly subtle semantic nuances, multi-language context, and complex relationships across massive datasets.

5. What is a Similarity Score?
A similarity score is a mathematical value calculated between two vectors that tells you how semantically close or related two statements are.

• Typically scaled between 0 and 1 (or -1 to 1).

• Higher scores mean the texts point in the same conceptual direction (high similarity).

• Lower scores mean the texts are unrelated or discuss entirely different topics.

6. Why Use Cosine Similarity?
Cosine similarity measures the cosine of the angle ($\theta$) between two vectors, completely ignoring their physical lengths.

• The Numerator (Dot Product): Multiplies overlapping feature values to calculate raw alignment.

• The Denominator (Product of Magnitudes): Calculates the lengths of both vectors and divides the dot product by them.

• Why it wins: It eliminates length bias. If a document is 50 pages long versus a 3-sentence summary, their raw vectors will differ greatly in size. Cosine similarity normalizes both vectors to a standard length, focusing purely on the direction of meaning.

7. What Are the Alternatives to Cosine Similarity?
• Euclidean Distance: Measures the straight-line distance between two points in space.

  • The Flaw: It is heavily affected by vector magnitude. Longer documents or repetitive phrasing will appear far away from short summaries, even if they discuss the exact same topic.

• Raw Dot Product: Multiplies and sums components without dividing by vector magnitudes.

  • The Flaw: It rewards longer texts because larger numbers inflate the product, making text length a confounding factor in similarity.

```
