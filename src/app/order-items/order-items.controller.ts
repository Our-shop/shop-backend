import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderItemsService } from './order-items.service';
import { OrderItemDto } from './dtos/order-item.dto';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @ApiOperation({ summary: 'Get all order items' })
  @Get()
  async getAllOrderItems() {
    const entities = await this.orderItemsService.getAllOrderItems();

    return OrderItemDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Get order-item by id' })
  @Get(':orderItemId')
  async getById(@Param('orderItemId') id: string) {
    const entity = await this.orderItemsService.getById(id);

    return OrderItemDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Get order-items by order-id' })
  @Get('order/:orderId')
  async getAllByOrderId(@Param('orderId') id: string) {
    const entities = await this.orderItemsService.getAllByOrderId(id);

    return OrderItemDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Add order-item' })
  @Post()
  async addOrderItem(@Body() dto: OrderItemDto) {
    const entity = await this.orderItemsService.addOrderItem(dto);

    return OrderItemDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Edit product quantity' })
  @Put(':orderItemId')
  async EditProductQuantity(
    @Param('orderItemId') id: string,
    @Body() dto: Partial<OrderItemDto>,
  ) {
    const entity = await this.orderItemsService.editProductQuantity(id, dto);

    return OrderItemDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Delete order item by id' })
  @Delete(':orderItemId')
  async deleteOrderItem(@Param('orderItemId') id: string) {
    const entity = await this.orderItemsService.deleteOrderItem(id);

    return OrderItemDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Delete order-items by cart-id' })
  @Delete('cart/:cartId')
  async deleteAllByCartId(@Param('cartId') id: string) {
    const entities = await this.orderItemsService.deleteAllByCartId(id);

    return OrderItemDto.fromEntities(entities) || null;
  }
}
