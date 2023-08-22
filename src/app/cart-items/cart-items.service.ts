import { Injectable } from '@nestjs/common';
import { CartItemsRepo } from './repos/cart-items.repo';
import { CartItemDto } from './dtos/cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(private readonly cartItemsRepo: CartItemsRepo) {}

  public async getCartItems(): Promise<CartItemDto[]> {
    const entities = await this.cartItemsRepo.getAll();

    return CartItemDto.fromEntities(entities) || [];
  }

  public async getCartItemById(cartItemId: string): Promise<CartItemDto> {
    const entity = await this.cartItemsRepo.getById(cartItemId);

    return CartItemDto.fromEntity(entity) || null;
  }

  public async getAllActiveByCartId(cartId: string): Promise<CartItemDto[]> {
    const entities = await this.cartItemsRepo.getAllActiveByCartId(cartId);

    return CartItemDto.fromEntities(entities) || [];
  }

  public async addCartItem(dto: CartItemDto): Promise<CartItemDto> {
    const entity = await this.cartItemsRepo.addOne(dto);

    return CartItemDto.fromEntity(entity) || null;
  }

  public async editProductQuantity(
    cartItemId: string,
    productQuantity: number,
  ): Promise<CartItemDto> {
    const entity = await this.cartItemsRepo.editProductQuantity(
      cartItemId,
      productQuantity,
    );

    return CartItemDto.fromEntity(entity) || null;
  }

  public async archiveCartItem(cartItemId: string) {
    const entity = await this.cartItemsRepo.archiveOne(cartItemId);

    return CartItemDto.fromEntity(entity) || null;
  }
}
