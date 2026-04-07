import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import {
  CreateProductMessage,
  DeleteProductMessage,
  GetProductMessage,
  ListProductsMessage,
  UpdateProductMessage,
} from './messages/product.messages';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'products_list' })
  list(payload: ListProductsMessage) {
    return this.productsService.list(payload);
  }

  @MessagePattern({ cmd: 'products_get' })
  getById(@Payload() payload: GetProductMessage) {
    return this.productsService.getById(payload.id);
  }

  @MessagePattern({ cmd: 'products.exists' })
  exists(@Payload() payload: { id: string }) {
    return this.productsService.exists(payload.id);
  }

  @MessagePattern({ cmd: 'products_create' })
  create(@Payload() payload: CreateProductMessage) {
    return this.productsService.create(payload);
  }

  @MessagePattern({ cmd: 'products_update' })
  update(@Payload() payload: UpdateProductMessage) {
    return this.productsService.update(payload);
  }

  @MessagePattern({ cmd: 'products_delete' })
  delete(@Payload() payload: DeleteProductMessage) {
    return this.productsService.delete(payload.id);
  }
}
