import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import {
  CreateProductMessage,
  ListProductsMessage,
  UpdateProductMessage,
} from './messages/product.messages';
import { Product, ProductVariant, ProductCategory } from './entity';
import { isUUID } from 'class-validator';
import { ProductVariantsService } from './product-variants.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,
    private readonly variantService: ProductVariantsService
  ) {}

  async list({ page, limit }: ListProductsMessage) {
    const take = Math.min(limit, 50);
    const skip = (page - 1) * take;

    const [items, total] = await this.productRepo.findAndCount({
      where: { isActive: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    const productIds = items.map((i) => i.id);
    const variants =
      await this.variantService.getVariantsByProductIds(productIds);
    const productsWithVariants = items.map((product) => ({
      ...product,
      variants: variants.filter((v) => v.productId === product.id),
    }));

    return {
      items: productsWithVariants as Product[] &
        { variants: ProductVariant[] }[],
      meta: {
        page,
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    };
  }

  async getById(id: string) {
    if (!isUUID(id)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid product id',
      });
    }
    const product = await this.productRepo.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: 'Product not found',
      });
    }
    const variants = await this.variantService.getVariantsByProductId(id);

    return { ...product, variants };
  }

  async exists(id: string) {
    const count = await this.productRepo.count({
      where: { id, isActive: true },
    });
    return count > 0;
  }

  async create(dto: CreateProductMessage) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new RpcException({
        statusCode: 404,
        message: 'Category not found',
      });
    }
    return this.productRepo.save({
      name: dto.name,
      description: dto.description,
      brand: dto.brand,
      categoryId: dto.categoryId,
      isActive: true,
    });
  }

  async update(payload: UpdateProductMessage) {
    const product = await this.productRepo.findOne({
      where: { id: payload.id },
    });

    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    Object.assign(product, payload);
    await this.productRepo.save(product);

    return this.getById(product.id);
  }

  async delete(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    product.isActive = false;
    // product.variants.forEach((v) => (v.isActive = false));

    await this.productRepo.save(product);
    // await this.variantRepo.save(product.variants);

    return { success: true };
  }
}
