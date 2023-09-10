import { Injectable } from '@nestjs/common';
import { ProductsRepo } from './products.repo';
import { ProductEntity } from '../../shared/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepo) {}

  public async getAllProducts(): Promise<ProductEntity[]> {
    return await this.productsRepo.getAllProducts();
  }

  public async getAllActiveProducts(): Promise<ProductEntity[]> {
    return await this.productsRepo.getAllActiveProducts();
  }

  public async searchActiveProducts(query: string): Promise<ProductEntity[]> {
    return await this.productsRepo.searchActiveProducts(query);
  }

  public async archiveOneProduct(id: string): Promise<ProductEntity> {
    return await this.productsRepo.archiveOneProduct(id);
  }

  public async archiveManyProducts(ids: string[]): Promise<ProductEntity[]> {
    return await this.productsRepo.archiveManyProducts(ids);
  }
}
