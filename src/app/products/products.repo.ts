import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ProductEntity } from '../../shared/entities/product.entity';
import { OrderItemEntity } from '../order-items/entities/order-item.entity';
import { BasicStatuses } from '../../shared/enums/basic-statuses.enum';

@Injectable()
export class ProductsRepo extends EntityRepository<ProductEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, ProductEntity);
  }

  public async getAllProducts(): Promise<ProductEntity[]> {
    return await this.findAll();
  }

  public async getAllActiveProducts(): Promise<ProductEntity[]> {
    return await this.find({ status: BasicStatuses.Active });
  }

  public async archiveOneProduct(id: string): Promise<ProductEntity> {
    const productToArchive = await this.findOne({ id });
    productToArchive.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(productToArchive);

    return productToArchive;
  }

  public async archiveManyProducts(ids: string[]): Promise<ProductEntity[]> {
    const productsToArchive = await this.find({ id: { $in: ids } });
    productsToArchive.forEach(
      (product) => (product.status = BasicStatuses.Archived),
    );
    await this.entityManager.persistAndFlush(productsToArchive);

    return productsToArchive;
  }

  public async getLackingProducts(
    dtos: OrderItemEntity[],
  ): Promise<ProductEntity[]> {
    return await this.find({
      $or: dtos.map((dto) => ({
        // $and instead of $or
        id: dto.productId,
        quantity: { $lt: dto.productQuantity },
      })),
    });
  }

  public async orderProducts(
    dtos: OrderItemEntity[],
  ): Promise<ProductEntity[]> {
    const ids = dtos.map((dto) => dto.productId);
    const productsToOrder = await this.find({ id: { $in: ids } });
    for (let i = 0; i < productsToOrder.length; i += 1) {
      productsToOrder[i].quantity -= dtos[i].productQuantity;
      await this.entityManager.persistAndFlush(productsToOrder[i]);
    }

    return productsToOrder;
  }
}
