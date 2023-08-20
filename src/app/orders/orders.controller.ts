import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {OrdersService} from './orders.service';
import {OrderDto} from './dtos/order.dto';
import {OrderEntity} from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    // TODO: Get Orders by User ID (take User Id from Delivery)

    @ApiOperation({ summary: 'Get all orders' })
    @Get()
    async getAllOrders(): Promise<OrderDto[]> {
        return await this.ordersService.getAllOrders();
    }

    @ApiOperation({ summary: 'Get order by id' })
    @Get('/:orderId')
    async getOrderById(@Param('orderId') id: string): Promise<OrderDto | string> {
        return await this.ordersService.getOrderById(id);
    }

    @ApiOperation({ summary: 'Add order' })
    @Post()
    async addOrder(@Body() newOrder: OrderDto): Promise<OrderEntity> {
        return this.ordersService.addOrder(newOrder);
    }

    @ApiOperation({ summary: 'Edit order' })
    @Put('/:orderId')
    async updateOrder(
        @Param('orderId') id: string,
        @Body() updatedOrderDto: Partial<OrderEntity>,
    ) {
        return this.ordersService.updateOrder(id, updatedOrderDto);
    }

    @ApiOperation({ summary: 'Archive order by id' })
    @Delete('/:orderId')
    async deleteOrder(@Param('orderId') id: string): Promise<OrderEntity | string> {
        return this.ordersService.deleteOrder(id);
    }
}
