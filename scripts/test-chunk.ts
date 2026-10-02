import { chunkText } from "../src/lib/chunk-text";

const text =
  "React is a JavaScript library for building user interfaces. React components are reusable pieces of UI that can accept data through props. React state allows components to store and manage data that can change over time.";

const chunks = chunkText(text, 80, 20);

console.log("Chunks:", chunks);
console.log("Number of chunks:", chunks.length);

chunks.forEach((chunk, index) => {
  console.log(`Chunk ${index}:`, chunk);
  console.log("Length:", chunk.length);
});
