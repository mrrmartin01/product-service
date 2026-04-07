import { ProductSize } from '../common/product.enums';

export interface VariantImagePayload {
  url: string;
  publicId: string;
  sortOrder?: number;
}

export interface CreateVariantMessage {
  productId: string;
  sku: string;
  size: ProductSize;
  color?: string;
  price: number;
  stock: number;
  images?: VariantImagePayload[];
}

export interface UpdateVariantMessage {
  productId: string;
  variantId: string;
  sku?: string;
  size?: ProductSize;
  color?: string;
  price?: number;
  stock?: number;
  addImages?: VariantImagePayload[];
  removeImageIds?: string[];
}

export interface DeleteVariantMessage {
  productId: string;
  variantId: string;
}
