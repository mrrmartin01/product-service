import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateCategoryMessage,
  DeleteCategoryMessage,
  UpdateCategoryMessage,
} from './messages/product-category.messages';
import { ProductCategoryService } from './productCategory.service';

@Controller()
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}
  @MessagePattern({ cmd: 'create_category' })
  createCategory(data: CreateCategoryMessage) {
    return this.categoryService.createCategory(data);
  }

  @MessagePattern({ cmd: 'update_category' })
  updateCategory(data: UpdateCategoryMessage) {
    return this.categoryService.updateCategory(data);
  }

  @MessagePattern({ cmd: 'delete_category' })
  deleteCategory(data: DeleteCategoryMessage) {
    return this.categoryService.deleteCategory(data);
  }
}
