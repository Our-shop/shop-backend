import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ProductEntity } from '../entities/product.entity';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductsRepo extends EntityRepository<ProductEntity> {
  public async getProducts() {
    return await this.findAll();
  }

  public async getProductById(id: string) {
    return await this.findOne({ id });
  }

  public async addProduct(dto: ProductDto) {
    const newProduct = await this.create({
      title: dto.title,
      price: dto.price,

      // it.title = entity.title;
      // it.price = entity.price;
      // it.description = entity.description;
      // it.image = entity.image;
      // it.quantity = entity.quantity;
      // it.category = entity.category;
      // it.type = entity.type;
      // it.expirationDate = entity.expirationDate.valueOf();
      // it.size = entity.size;
      // it.recommendedAge = entity.recommendedAge;
    });
    console.log('addProduct');

    return newProduct;
  }
}
