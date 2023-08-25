import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { OrderEntity } from '../entities/order.entity';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { OrderStatuses } from '../enums/order-statuses.enum';
import { OrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersRepo extends EntityRepository<OrderEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, OrderEntity);
  }

  // ORDERS
  public async getAllOrders(): Promise<OrderEntity[]> {
    return await this.find({ orderStatus: OrderStatuses.InOrder });
  }

  public async getOrderById(id: string): Promise<OrderEntity> {
    return await this.findOne({ id, orderStatus: OrderStatuses.InOrder });
  }

  public async getAllCarts(): Promise<OrderEntity[]> {
    return await this.find({ orderStatus: OrderStatuses.InCart });
  }

  public async getOrdersByUserId(userId: string): Promise<OrderEntity[]> {
    return await this.find({ userId, orderStatus: OrderStatuses.InOrder });
  }

  public async makeOrder(dto: OrderDto): Promise<OrderEntity> {
    const newOrder = await this.findOne({ id: dto.id });
    newOrder.orderStatus = OrderStatuses.InOrder;
    newOrder.deliveryId = dto.deliveryId;
    newOrder.totalAmount = dto.totalAmount;
    await this.entityManager.persistAndFlush(newOrder);

    const newCart = await this.create({
      userId: newOrder.userId,
      discount: 0,
    });
    await this.entityManager.persistAndFlush(newCart);

    return newOrder;
  }

  public async archiveOrder(id: string): Promise<OrderEntity> {
    const orderToArchive = await this.findOne({ id });
    orderToArchive.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(orderToArchive);

    return orderToArchive;
  }

  // CARTS
  public async getCartById(id: string): Promise<OrderEntity> {
    return await this.findOne({ id, orderStatus: OrderStatuses.InCart });
  }

  public async getCartByUserId(userId: string): Promise<OrderEntity> {
    return await this.findOne({ userId, orderStatus: OrderStatuses.InCart });
  }

  public async addNewCart(userId: string): Promise<OrderEntity> {
    const newCart = await this.create({
      userId: userId,
      discount: 10,
    });
    await this.entityManager.persistAndFlush(newCart);

    return newCart;
  }

  public async editCartDiscount(
    id: string,
    dto: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    const cartToEdit = await this.findOne({ id });
    cartToEdit.discount = dto.discount;
    await this.entityManager.persistAndFlush(cartToEdit);

    return cartToEdit;
  }

  public async archiveCartByUserId(userId: string): Promise<OrderEntity> {
    const cartToArchive = await this.findOne({
      userId: userId,
      orderStatus: OrderStatuses.InCart,
    });
    cartToArchive.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(cartToArchive);

    return cartToArchive;
  }
}
