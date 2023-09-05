import { Injectable } from '@nestjs/common';
import { OrderItemsRepo } from './repos/order-item.repo';
import { OrderItemDto } from './dtos/order-item.dto';
import { OrderItemEntity } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(private readonly orderItemsRepo: OrderItemsRepo) {}

  public async getAllOrderItems(): Promise<OrderItemEntity[]> {
    return await this.orderItemsRepo.getAll();
  }

  public async getById(id: string): Promise<OrderItemEntity> {
    return await this.orderItemsRepo.getById(id);
  }

  public async getAllByOrderId(id: string): Promise<OrderItemEntity[]> {
    return await this.orderItemsRepo.getAllByOrderId(id);
  }

  public async addOrderItem(dto: OrderItemDto): Promise<OrderItemEntity> {
    return await this.orderItemsRepo.addOrderItem(dto);
  }

  public async editProductQuantity(
    id: string,
    dto: Partial<OrderItemDto>,
  ): Promise<OrderItemEntity> {
    return await this.orderItemsRepo.editProductQuantity(id, dto);
  }

  public async deleteOrderItem(id: string): Promise<OrderItemEntity> {
    return await this.orderItemsRepo.deleteOrderItem(id);
  }

  public async deleteAllByCartId(orderId: string): Promise<OrderItemEntity[]> {
    return await this.orderItemsRepo.deleteAllByCartId(orderId);
  }
}
