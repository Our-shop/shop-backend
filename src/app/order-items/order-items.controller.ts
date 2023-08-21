import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {OrderItemsService} from './order-items.service';
import {OrderItemDto} from './dtos/order-item.dto';
import {OrderItemEntity} from './entities/order-item.entity';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemsController {
    constructor(private readonly orderItemsService: OrderItemsService) {}

    @ApiOperation({ summary: 'Get all order items' })
    @Get()
    async getAllOrderItems(): Promise<OrderItemDto[]> {
        return await this.orderItemsService.getAllOrderItems();
    }

    @ApiOperation({ summary: 'Get order item by id' })
    @Get('/:orderItemId')
    async getOrderItemById(@Param('orderItemId') id: string): Promise<OrderItemDto | string> {
        return await this.orderItemsService.getOrderItemById(id);
    }

    @ApiOperation({ summary: 'Add order item' })
    @Post()
    async addOrderItem(@Body() newOrderItem: OrderItemDto): Promise<OrderItemEntity> {
        return this.orderItemsService.addOrderItem(newOrderItem);
    }

    @ApiOperation({ summary: 'Edit order item' })
    @Put('/:orderItemId')
    async updateOrderItem(
        @Param('orderItemId') id: string,
        @Body() updatedOrderItemDto: Partial<OrderItemEntity>,
    ) {
        return this.orderItemsService.updateOrderItem(id, updatedOrderItemDto);
    }

    @ApiOperation({ summary: 'Archive order item by id' })
    @Delete('/:orderItemId')
    async deleteOrderItem(@Param('orderItemId') id: string): Promise<OrderItemEntity | string> {
        return this.orderItemsService.deleteOrderItem(id);
    }
}
