import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {OrdersService} from './orders.service';
import {OrderDto} from './dtos/order.dto';
import {OrderEntity} from './entities/order.entity';
import {NewOrderDto} from './dtos/new-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

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

    @ApiOperation({ summary: 'Get orders by user id' })
    @Get('user/:userId')
    async getOrdersByUserId(@Param('userId') id: string): Promise<OrderDto[] | string> {
        return await this.ordersService.getOrdersByUserId(id);
    }

    // TODO add switch in service method
    // @ApiOperation({ summary: 'Add order' })
    // @Post()
    // async addOrder(@Body() newOrder: NewOrderDto): Promise<OrderEntity | string> {
    //     return await this.ordersService.createOrder(newOrder);
    // }

    @ApiOperation({ summary: 'Edit order' })
    @Put('/:orderId')
    async updateOrder(
        @Param('orderId') id: string,
        @Body() updatedOrderDto: Partial<OrderEntity>,
    ) {
        return await this.ordersService.updateOrder(id, updatedOrderDto);
    }

    @ApiOperation({ summary: 'Archive order by id' })
    @Delete('/:orderId')
    async deleteOrder(@Param('orderId') id: string): Promise<OrderEntity | string> {
        return await this.ordersService.deleteOrder(id);
    }
}
