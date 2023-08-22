import { Injectable } from '@nestjs/common';
import { CartDto } from './dtos/cart.dto';
import { CartsRepo } from './repos/carts.repo';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepo: CartsRepo,
  ) {}

  public async getCarts(): Promise<CartDto[]> {
    const entities = await this.cartsRepo.getAll();

    return CartDto.fromEntities(entities) || [];
  }

  public async getCartById(cartId: string): Promise<CartDto> {
    const entity = await this.cartsRepo.getById(cartId);

    return CartDto.fromEntity(entity) || null;
  }

  public async getActiveCartById(userId: string): Promise<CartDto> {
    const entity = await this.cartsRepo.getActiveCardByUserId(userId);

    return CartDto.fromEntity(entity) || null;
  }

  public async editCartDiscount(
    cartId: string,
    discount: number,
  ): Promise<CartDto> {
    const entity = await this.cartsRepo.editCartDiscount(cartId, discount);

    return CartDto.fromEntity(entity) || null;
  }
}
