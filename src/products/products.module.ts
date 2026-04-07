import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductVariantsController } from './product-variants.controller';
import { ProductsService } from './products.service';
import { ProductVariantsService } from './product-variants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
} from './entity';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './productCategory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductCategory,
      ProductImage,
    ]),
  ],
  controllers: [
    ProductsController,
    ProductVariantsController,
    ProductCategoryController,
  ],
  providers: [ProductsService, ProductVariantsService, ProductCategoryService],
})
export class ProductsModule {}
