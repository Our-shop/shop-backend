import { Injectable } from '@nestjs/common';
import {OrdersRepo} from './repos/orders.repo';
import {OrderDto} from './dtos/order.dto';
import {OrderEntity} from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(private readonly orderRepo: OrdersRepo) {}

    async getAllOrders(): Promise<OrderDto[]> {
        return await this.orderRepo.getList();
    }

    async getOrderById(id: string): Promise<OrderDto | string> {
        return await this.orderRepo.getOrder(id);
    }

    async addOrder(newOrder: OrderDto): Promise<OrderEntity> {
        return this.orderRepo.addOrder(newOrder);
    }

    async updateOrder(id: string, updatedOrderDto: Partial<OrderEntity>) {
        return this.orderRepo.updateOrder(id, updatedOrderDto);
    }

    async deleteOrder(id: string): Promise<OrderEntity | string> {
        return this.orderRepo.deleteOrder(id);
    }
}
