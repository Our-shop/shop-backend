import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartItemsService } from './cart-items.service';
import { CartItemDto } from './dtos/cart-item.dto';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @ApiOperation({ summary: 'Get all cart-items' })
  @Get()
  public async getCartItems() {
    return await this.cartItemsService.getCartItems();
  }

  @ApiOperation({ summary: 'Get cart-item by id' })
  @Get(':cartItemId')
  public async getCartById(@Param('cartItemId') cartItemId: string) {
    return await this.cartItemsService.getCartItemById(cartItemId);
  }

  @ApiOperation({ summary: 'Get active cart-items by cart-id' })
  @Get('active/:cartId')
  public async getAllActiveByCartId(@Param('cartId') cartId: string) {
    return await this.cartItemsService.getAllActiveByCartId(cartId);
  }

  @ApiOperation({ summary: 'Add cart-item' })
  @Post()
  public async addCartItem(@Body() dto: CartItemDto) {
    return await this.cartItemsService.addCartItem(dto);
  }

  @ApiOperation({ summary: 'Edit cart-item product quantity' })
  @Put(':cartItemId')
  public async editProductQuantity(
    @Param('cartItemId') cartItemId: string,
    @Body() requestBody: { productQuantity: number },
  ) {
    const { productQuantity } = requestBody;

    return await this.cartItemsService.editProductQuantity(
      cartItemId,
      productQuantity,
    );
  }

  @ApiOperation({ summary: 'Archive cart-item by id' })
  @Delete(':cartItemId')
  public async archiveCartItem(@Param('cartItemId') cartItemId: string) {
    return await this.cartItemsService.archiveCartItem(cartItemId);
  }
}
