import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrderDto } from './dtos/order.dto';
import { OrderEntity } from './entities/order.entity';
import { JwtService } from '@nestjs/jwt';

@ApiTags('orders')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,
              private readonly jwtService: JwtService) {}

  // ORDERS
  @ApiOperation({ summary: 'Get all orders' })
  @Get('orders')
  public async getAllOrders() {
    const entities = await this.ordersService.getAllOrders();

    return OrderDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Get order by id' })
  @Get('orders/:orderId')
  public async getOrderById(@Param('orderId') id: string) {
    const entity = await this.ordersService.getOrderById(id);

    return OrderDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Get orders by user id' })
  @Get('orders/user/:userId')
  public async getOrdersByUserId(@Param('userId') id: string) {
    const entities = await this.ordersService.getOrdersByUserId(id);

    return OrderDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Make order from cart' })
  @Post('orders')
  public async makeOrder(@Body() dto: OrderDto) {
    const result = await this.ordersService.makeOrder(dto);

    return typeof result === 'string'
      ? result
      : OrderDto.fromEntity(result) || null;
  }

  @ApiOperation({ summary: 'Archive order by id' })
  @Delete('orders/:orderId')
  async archiveOrder(@Param('orderId') id: string) {
    const entity = await this.ordersService.archiveOrder(id);

    return OrderDto.fromEntity(entity) || null;
  }

  // CARTS
  @ApiOperation({ summary: 'Get all carts' })
  @Get('carts')
  public async getAllCarts() {
    const entities = await this.ordersService.getAllCarts();

    return OrderDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Get cart by id' })
  @Get('carts/:cartId')
  public async getCartById(@Param('cartId') id: string) {
    const entity = await this.ordersService.getOrderById(id);

    return OrderDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Get cart by user id' })
  @Get('carts/user/:userId')
  public async getCartByUserId(@Param('userId') id: string) {
    const entity = await this.ordersService.getCartByUserId(id);

    return OrderDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Get active cart by token' })
  @Get('active-cart')
  public async getActiveCart(@Headers('Authorization') token: string) {
    const entity = await this.ordersService.getActiveCart(token.split(' ')[1]);

    return OrderDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Edit cart discount' })
  @Put('carts/:cartId')
  public async editCartDiscount(
    @Param('cartId') id: string,
    @Body() dto: Partial<OrderEntity>,
  ) {
    const entity = await this.ordersService.editCartDiscount(id, dto);

    return OrderDto.fromEntity(entity) || null;
  }
}
