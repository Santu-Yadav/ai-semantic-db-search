export type SearchItem = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export type SearchResponse = {
  results: SearchItem[];
  suggestions: SearchItem[];
};
