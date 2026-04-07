import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductVariantsService } from './product-variants.service';
import {
  CreateVariantMessage,
  DeleteVariantMessage,
  UpdateVariantMessage,
} from './messages/product-variant.messages';

@Controller()
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @MessagePattern({ cmd: 'variants_by_product' })
  getVariantsByProductId(@Payload() productId: string[]) {
    return this.variantsService.getVariantsByProductIds(productId);
  }

  @MessagePattern({ cmd: 'variants_create' })
  createVariant(@Payload() payload: CreateVariantMessage) {
    return this.variantsService.createVariant(payload);
  }

  @MessagePattern({ cmd: 'variants_update' })
  updateVariant(@Payload() payload: UpdateVariantMessage) {
    return this.variantsService.updateVariant(payload);
  }

  @MessagePattern({ cmd: 'variants_delete' })
  deleteVariant(@Payload() payload: DeleteVariantMessage) {
    return this.variantsService.deleteVariant(payload);
  }
}
