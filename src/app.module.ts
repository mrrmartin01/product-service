import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
} from './products/entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '..env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Product, ProductVariant, ProductCategory, ProductImage],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: true,
      }),
    }),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
