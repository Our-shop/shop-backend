import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductEntity } from "./entities/product.entity";
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsRepo } from "./repos/products.repo";


@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [ProductEntity],
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepo],
})
export class ProductsModule {}
