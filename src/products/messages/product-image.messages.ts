export interface AddVariantImagesMessage {
  variantId: string;
  images: {
    url: string;
    publicId: string;
    sortOrder: number;
  }[];
}

export interface RemoveVariantImagesMessage {
  variantId: string;
  imageIds: string[];
}
