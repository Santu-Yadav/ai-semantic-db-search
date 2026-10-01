export function chunkText(
  text: string,
  chunkSize: number,
  overlap: number,
): string[] {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    chunks.push(text.slice(start, end));

    start += chunkSize - overlap;
  }

  return chunks;
}

const text =
  "React is a JavaScript library for building user interfaces. React components are reusable pieces of UI.";

const chunks = chunkText(text, 50, 10);

console.log(chunks);
