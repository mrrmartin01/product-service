import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'product_images' })
@Index(['id', 'variantId', 'url'], { unique: true })
export default class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  variantId: string;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column({ default: 0 })
  sortOrder: number;
}
