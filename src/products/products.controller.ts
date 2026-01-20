import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductsController {
  //
  @MessagePattern({ cmd: 'get_products' })
  getProducts(@Payload() data: string) {
    console.log(data);
    return data;
  }
  //
  getProductById() {}
  //
  createProduct() {}
  //
  editProduct() {}
  //
  deleteProduct() {}
}
