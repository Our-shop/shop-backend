import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderItemDto } from '../dtos/order-item.dto';
import { ProductEntity } from '../../../shared/entities/product.entity';

@Injectable()
export class OrderItemsRepo extends EntityRepository<OrderItemEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, OrderItemEntity);
  }

  public async getAll(): Promise<OrderItemEntity[]> {
    return await this.findAll();
  }

  public async getById(id: string): Promise<OrderItemEntity> {
    return await this.findOne({ id });
  }

  public async getAllByOrderId(orderId: string): Promise<OrderItemEntity[]> {
    return await this.find({ orderId: orderId });
  }

  public async addOrderItem(dto: OrderItemDto): Promise<OrderItemEntity> {
    const newOrderItem = await this.create({
      orderId: dto.orderId,
      productId: dto.productId,
    });
    await this.entityManager.persistAndFlush(newOrderItem);

    return newOrderItem;
  }

  public async editProductQuantity(
    id: string,
    dto: Partial<OrderItemEntity>,
  ): Promise<OrderItemEntity> {
    const itemToEdit = await this.findOne({ id });
    itemToEdit.productQuantity = dto.productQuantity;
    await this.entityManager.persistAndFlush(itemToEdit);

    return itemToEdit;
  }

  public async deleteOrderItem(id: string): Promise<OrderItemEntity> {
    const itemToDelete = await this.findOne({ id });
    await this.entityManager.removeAndFlush(itemToDelete);

    return itemToDelete;
  }

  public async deleteAllByCartId(orderId: string): Promise<OrderItemEntity[]> {
    const itemsToDelete = await this.find({ orderId: orderId });
    await this.entityManager.removeAndFlush(itemsToDelete);

    return itemsToDelete;
  }

  public async editOrderItems(orderId: string, products: ProductEntity[]) {
    const itemsToEdit = await this.find({ orderId: orderId });
    itemsToEdit.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      item.productTitle = product.title;
      item.productPrice = product.price;
    });
    await this.entityManager.persistAndFlush(itemsToEdit);

    return itemsToEdit;
  }
}
