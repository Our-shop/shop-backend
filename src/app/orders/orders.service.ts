import { Injectable } from '@nestjs/common';
import {OrdersRepo} from './repos/orders.repo';
import {OrderDto} from './dtos/order.dto';
import {OrderEntity} from './entities/order.entity';
import {NewOrderDto} from './dtos/new-order.dto';
import {OrderItemsRepo} from '../order-items/repos/order-item.repo';
import {OrderItemDto} from '../order-items/dtos/order-item.dto';

@Injectable()
export class OrdersService {
    constructor(
        private readonly orderRepo: OrdersRepo,
        private readonly orderItemsRepo: OrderItemsRepo
    ) {}

    async getAllOrders(): Promise<OrderDto[]> {
        return await this.orderRepo.getList();
    }

    async getOrderById(id: string): Promise<OrderDto | string> {
        return await this.orderRepo.getOrder(id);
    }

    async getOrdersByUserId(userId : string): Promise<OrderDto[]> {
        return await this.orderRepo.getOrdersByUserId(userId);
    }

    async createOrder(newOrder: NewOrderDto) {
        const totalAmount = newOrder.products.reduce(
            (total, product) => total + product.price * product.quantity, 0);
        const orderDto = new OrderDto();
        Object.assign(orderDto, newOrder);
        orderDto.totalAmount = totalAmount;
        const createdOrder = await this.orderRepo.addOrder(orderDto);

        // Order items creation:
        newOrder.products.map(product => {
            const newOrderItem = new OrderItemDto();
            const newData = {
                title: product.title,
                price: product.price,
                quantity: product.quantity,
            }
            Object.assign(newOrderItem, newData);
            newOrderItem.orderId = createdOrder.id;
            this.orderItemsRepo.addOrderItem(newOrderItem);
        })

        return createdOrder;
    }

    async updateOrder(id: string, updatedOrderDto: Partial<OrderEntity>) {
        return this.orderRepo.updateOrder(id, updatedOrderDto);
    }

    async deleteOrder(id: string): Promise<OrderEntity | string> {
        return this.orderRepo.deleteOrder(id);
    }
}
