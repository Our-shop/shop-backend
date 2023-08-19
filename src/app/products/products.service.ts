import { Injectable } from '@nestjs/common';
import { ProductsRepo } from './repos/products.repo';
import { ProductDto } from './dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepo) {}

  public async getProducts(): Promise<ProductDto[]> {
    const entities = await this.productsRepo.getAll();

    return ProductDto.fromEntities(entities) || [];
  }

  public async getProductById(productId: string): Promise<ProductDto> {
    const entity = await this.productsRepo.getById(productId);

    return ProductDto.fromEntity(entity) || null;
  }

  public async addProduct(dto: ProductDto): Promise<ProductDto> {
    const entity = await this.productsRepo.addOne(dto);

    return ProductDto.fromEntity(entity);
  }

  public async editProduct(
    productId: string,
    dto: Partial<ProductDto>,
  ): Promise<ProductDto> {
    const entity = await this.productsRepo.editOne(productId, dto);

    return ProductDto.fromEntity(entity) || null;
  }

  public async archiveProduct(productId: string): Promise<ProductDto> {
    const entity = await this.productsRepo.archiveOne(productId);

    return ProductDto.fromEntity(entity) || null;
  }
}
