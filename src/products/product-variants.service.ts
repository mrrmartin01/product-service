import { Injectable } from '@nestjs/common';
import {
  CreateVariantMessage,
  UpdateVariantMessage,
  DeleteVariantMessage,
} from './messages/product-variant.messages';
import { ProductVariant, ProductImage } from './entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>
  ) {}

  async getVariantsByProductIds(productId: string[]) {
    return this.variantRepo.find({
      where: { productId: In(productId), isActive: true },
    });
  }

  async getVariantsByProductId(productId: string) {
    return this.variantRepo.find({
      where: { productId, isActive: true },
    });
  }

  async createVariant(payload: CreateVariantMessage) {
    const variant = this.variantRepo.create({
      productId: payload.productId,
      sku: payload.sku,
      size: payload.size,
      color: payload.color,
      price: payload.price,
      stock: payload.stock,
      isActive: true,
    });

    const savedVariant = await this.variantRepo.save(variant);

    if (payload.images?.length) {
      const images = payload.images.map((img) =>
        this.imageRepo.create({
          variantId: savedVariant.id,
          url: img.url,
          publicId: img.publicId,
          sortOrder: img.sortOrder ?? 0,
        })
      );

      await this.imageRepo.save(images);
    }

    return this.variantRepo.findOne({
      where: { id: savedVariant.id },
      relations: ['images'],
    });
  }

  async updateVariant(payload: UpdateVariantMessage) {
    const variant = await this.variantRepo.findOne({
      where: {
        id: payload.variantId,
        productId: payload.productId,
        isActive: true,
      },
      relations: ['images'],
    });

    if (!variant) {
      throw new RpcException({
        statusCode: 404,
        message: 'Variant not found',
      });
    }

    // Update scalar fields safely
    if (payload.sku !== undefined) variant.sku = payload.sku;
    if (payload.size !== undefined) variant.size = payload.size;
    if (payload.color !== undefined) variant.color = payload.color;
    if (payload.price !== undefined) variant.price = payload.price;
    if (payload.stock !== undefined) variant.stock = payload.stock;

    await this.variantRepo.save(variant);

    /* ---------- Remove images ---------- */
    if (payload.removeImageIds?.length) {
      await this.imageRepo.delete({
        id: In(payload.removeImageIds),
        variantId: variant.id,
      });
    }

    /* ---------- Add images ---------- */
    if (payload.addImages?.length) {
      const images = payload.addImages.map((img) =>
        this.imageRepo.create({
          variantId: variant.id,
          url: img.url,
          publicId: img.publicId,
          sortOrder: img.sortOrder ?? 0,
        })
      );

      await this.imageRepo.save(images);
    }

    return this.variantRepo.findOne({
      where: { id: variant.id },
      relations: ['images'],
    });
  }

  async deleteVariant(payload: DeleteVariantMessage) {
    const variant = await this.variantRepo.findOne({
      where: {
        id: payload.variantId,
        productId: payload.productId,
        isActive: true,
      },
    });

    if (!variant) {
      throw new RpcException({
        statusCode: 404,
        message: 'Variant not found',
      });
    }

    variant.isActive = false;
    await this.variantRepo.save(variant);

    return { success: true };
  }
}
