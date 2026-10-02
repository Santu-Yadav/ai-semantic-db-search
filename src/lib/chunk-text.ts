export function chunkText(
  text: string,
  chunkSize: number,
  overlap: number,
): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];

  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();

    if (
      currentChunk &&
      currentChunk.length + trimmedSentence.length + 1 > chunkSize
    ) {
      chunks.push(currentChunk.trim());

      const words = currentChunk.trim().split(/\s+/);

      let overlapText = "";

      for (let i = words.length - 1; i >= 0; i--) {
        const candidate = `${words[i]} ${overlapText}`.trim();

        if (candidate.length > overlap) {
          break;
        }

        overlapText = candidate;
      }

      currentChunk = `${overlapText} ${trimmedSentence}`.trim();
    } else {
      currentChunk += `${trimmedSentence} `;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
