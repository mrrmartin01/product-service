import { Injectable } from '@nestjs/common';
import {
  CreateCategoryMessage,
  DeleteCategoryMessage,
  UpdateCategoryMessage,
} from './messages/product-category.messages';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>
  ) {}
  async createCategory(data: CreateCategoryMessage) {
    if (!data) {
      throw new RpcException({
        statusCode: 400,
        message: 'No data was provided for the category creation',
      });
    }
    const existingCategory = await this.categoryRepo.findOne({
      where: { name: data.name },
    });
    if (existingCategory) {
      throw new RpcException({
        statusCode: 409,
        message: 'Category with the same name already exists',
      });
    }
    const name = data.name.trim().toLowerCase();
    const slug = name.replace(/\s+/g, '-');

    const newCategory = this.categoryRepo.create({ name, slug });
    await this.categoryRepo.save(newCategory);
    return {
      message: 'Category created successfully',
      data: { ...newCategory },
    };
  }

  updateCategory(data: UpdateCategoryMessage) {
    return { message: 'Update complete', data };
  }
  deleteCategory(data: DeleteCategoryMessage) {
    return { message: 'Delete done', data };
  }
}
