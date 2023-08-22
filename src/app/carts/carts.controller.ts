import { Controller, Get, Param, Body, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'Get all carts' })
  @Get()
  public async getProducts() {
    return await this.cartsService.getCarts();
  }

  @ApiOperation({ summary: 'Get cart by id' })
  @Get(':cartId')
  public async getCartById(@Param('cartId') cartId: string) {
    return await this.cartsService.getCartById(cartId);
  }

  @ApiOperation({ summary: 'Get active cart by userId' })
  @Get('active/:userId:')
  public async getActiveCartById(@Param('userId') userId: string) {
    return await this.cartsService.getActiveCartById(userId);
  }

  @ApiOperation({ summary: 'Edit cart discount' })
  @Put(':cartId')
  public async editCartDiscount(
    @Param('cartId') cartId: string,
    @Body() requestBody: { discount: number },
  ) {
    const { discount } = requestBody;

    return await this.cartsService.editCartDiscount(cartId, discount);
  }
}
