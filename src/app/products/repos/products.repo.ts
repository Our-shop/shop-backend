import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ProductEntity } from '../entities/product.entity';
import { ProductDto } from '../dtos/product.dto';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';

@Injectable()
export class ProductsRepo extends EntityRepository<ProductEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, ProductEntity);
  }

  public async getAll(): Promise<ProductEntity[]> {
    return await this.findAll();
  }

  public async getById(id: string): Promise<ProductEntity> {
    return await this.findOne({ id });
  }

  public async addOne(dto: ProductDto): Promise<ProductEntity> {
    const newProduct = await this.create({
      title: dto.title,
      price: dto.price,
      description: dto.description,
      image: dto.image,
      quantity: dto.quantity,
      category: dto.category,
      type: dto.type,
      expirationDate: dto.expirationDate,
      size: dto.size,
      recommendedAge: dto.recommendedAge,
    });
    await this.entityManager.persistAndFlush(newProduct);

    return newProduct;
  }

  public async editOne(
    id: string,
    dto: Partial<ProductDto>,
  ): Promise<ProductEntity> {
    const productToEdit = await this.findOne({ id });
    Object.assign(productToEdit, dto);
    await this.entityManager.persistAndFlush(productToEdit);

    return productToEdit;
  }

  public async archiveOne(id: string): Promise<ProductEntity> {
    const productToArchive = await this.findOne({ id });
    productToArchive.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(productToArchive);

    return productToArchive;
  }
}
