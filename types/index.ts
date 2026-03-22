export type Card = {
  id: string;
  title: string;
  dueDate: string | null; // "YYYY-MM-DD" or null
  url: string;
  listId: string;
};

export type List = {
  id: string;
  name: string;
};

export type BoardState = {
  lists: List[];
  cards: Card[];
};

export type ViewMode = "board" | "timeline";
