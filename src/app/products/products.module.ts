import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProductsRepo } from './products.repo';
import { ProductEntity } from '../../shared/entities/product.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [ProductEntity],
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepo],
  exports: [ProductsRepo],
})
export class ProductsModule {}
