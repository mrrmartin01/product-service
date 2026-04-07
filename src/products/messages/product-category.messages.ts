export interface CreateCategoryMessage {
  name: string;
  slug: string;
}

export interface UpdateCategoryMessage {
  categoryId: string;
  name?: string;
  slug?: string;
}

export interface DeleteCategoryMessage {
  categoryId: string;
}
