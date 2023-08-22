import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { CartItemEntity } from '../entities/cart-item.entity';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { CartItemDto } from '../dtos/cart-item.dto';

@Injectable()
export class CartItemsRepo extends EntityRepository<CartItemEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, CartItemEntity);
  }

  public async getAll(): Promise<CartItemEntity[]> {
    return await this.findAll();
  }

  public async getById(id: string): Promise<CartItemEntity> {
    return await this.findOne({ id });
  }

  public async getAllByCartId(cartId: string): Promise<CartItemEntity[]> {
    return await this.find({ cartId: cartId });
  }

  public async getAllActiveByCartId(cartId: string): Promise<CartItemEntity[]> {
    return await this.find({ cartId: cartId, status: BasicStatuses.Active });
  }

  public async addOne(dto: CartItemDto): Promise<CartItemEntity> {
    const newCartItem = await this.create({
      cartId: dto.cartId,
      productId: dto.productId,
      productQuantity: 1,
    });
    await this.entityManager.persistAndFlush(newCartItem);

    return newCartItem;
  }

  public async editProductQuantity(
    id: string,
    productQuantity: number,
  ): Promise<CartItemEntity> {
    const cartItem = await this.findOne({ id });
    cartItem.productQuantity = productQuantity;
    await this.entityManager.persistAndFlush(cartItem);

    return cartItem;
  }

  public async archiveOne(id: string): Promise<CartItemEntity> {
    const cartItem = await this.findOne({ id });
    cartItem.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(cartItem);

    return cartItem;
  }

  public async archiveAllByCartId(cartId: string): Promise<CartItemEntity[]> {
    const cartItems = await this.find({
      cartId: cartId,
      status: BasicStatuses.Active,
    });
    cartItems.forEach((cartItem) => {
      cartItem.status = BasicStatuses.Archived;
      return cartItem;
    });
    await this.entityManager.persistAndFlush(cartItems);

    return cartItems;
  }
}
