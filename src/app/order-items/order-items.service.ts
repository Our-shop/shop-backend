import { Injectable } from '@nestjs/common';
import {OrderItemsRepo} from './repos/order-item.repo';
import {OrderItemDto} from './dtos/order-item.dto';
import {OrderItemEntity} from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
    constructor(private readonly orderItemsRepo: OrderItemsRepo) {}

    async getAllOrderItems(): Promise<OrderItemDto[]> {
        return await this.orderItemsRepo.getList();
    }

    async getOrderItemById(id: string): Promise<OrderItemDto | string> {
        return await this.orderItemsRepo.getOrderItem(id);
    }

    async addOrderItem(newOrderItem: OrderItemDto): Promise<OrderItemEntity> {
        return this.orderItemsRepo.addOrderItem(newOrderItem);
    }

    async updateOrderItem(id: string, updatedOrderItemDto: Partial<OrderItemEntity>) {
        return this.orderItemsRepo.updateOrderItem(id, updatedOrderItemDto);
    }

    async deleteOrderItem(id: string): Promise<OrderItemEntity | string> {
        return this.orderItemsRepo.deleteOrderItem(id);
    }
}



