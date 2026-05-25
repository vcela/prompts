export interface Category {
  id: string;
  name: string;
  color: string;
  _count?: { prompts: number };
  createdAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}
