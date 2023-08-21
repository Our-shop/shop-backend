import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartsRepo extends EntityRepository<CartEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, CartEntity);
  }

  public async getAll(): Promise<CartEntity[]> {
    return await this.findAll();
  }

  public async getById(id: string): Promise<CartEntity> {
    return await this.findOne({ id });
  }

  public async addOne(userId: string): Promise<CartEntity> {
    const newCart = await this.create({
      id: userId,
      discount: 10,
    });
    await this.entityManager.persistAndFlush(newCart);

    return newCart;
  }

  public async editCartDiscount(
    id: string,
    discount: number,
  ): Promise<CartEntity> {
    const cartToEdit = await this.findOne({ id });
    cartToEdit.discount = discount;
    await this.entityManager.persistAndFlush(cartToEdit);

    return cartToEdit;
  }

  public async archiveOne(id: string): Promise<CartEntity> {
    const cartToArchive = await this.findOne({ id });
    cartToArchive.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(cartToArchive);

    return cartToArchive;
  }
}
