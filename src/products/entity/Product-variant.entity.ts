import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ProductSize } from '../common/product.enums';

@Entity({ name: 'product_variants' })
@Index(['id', 'productId', 'sku'], { unique: true })
export default class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  productId: string;

  @Column()
  sku: string;

  @Column({ type: 'enum', enum: ProductSize })
  size: ProductSize;

  @Column({ nullable: true })
  color?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ default: true })
  isActive: boolean;
}
