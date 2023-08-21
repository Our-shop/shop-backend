import { Controller, Get, Param, Body, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';

@ApiTags('carts')
@Controller('products')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'Get all carts' })
  @Get()
  public async getProducts() {
    return await this.cartsService.getCarts();
  }

  @ApiOperation({ summary: 'Get cart by id' })
  @Get('cartId:')
  public async getProductById(@Param('cartId') cartId: string) {
    return await this.cartsService.getCartById(cartId);
  }

  @ApiOperation({ summary: 'Edit cart discount' })
  @Put(':cartId')
  public async editProduct(
    @Param('cartId') cartId: string,
    @Body() discount: number,
  ) {
    return await this.cartsService.editDiscount(cartId, discount);
  }
}
