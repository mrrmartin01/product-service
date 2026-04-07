export interface ListProductsMessage {
  page: number;
  limit: number;
}

export interface GetProductMessage {
  id: string;
}

export interface CreateProductMessage {
  name: string;
  description: string;
  brand: string;
  categoryId: string;
  isActive: boolean;
  variants: {
    sku: string;
    size: string;
    color?: string;
    price: number;
    stock: number;
  }[];
}

export interface UpdateProductMessage {
  id: string;
  name?: string;
  description?: string;
  brand?: string;
  categoryId?: string;
  isActive?: boolean;
}

export interface DeleteProductMessage {
  id: string;
}
