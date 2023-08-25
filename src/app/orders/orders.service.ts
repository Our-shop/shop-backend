import { Injectable } from '@nestjs/common';
import { OrdersRepo } from './repos/orders.repo';
import { OrderDto } from './dtos/order.dto';
import { OrderEntity } from './entities/order.entity';
import { NewOrderDto } from './dtos/new-order.dto';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';
import { OrderItemDto } from '../order-items/dtos/order-item.dto';
import { ProductDto } from '../../shared/dto/product.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepo,
    private readonly orderItemsRepo: OrderItemsRepo,
  ) {}

  async getAllOrders(): Promise<OrderDto[]> {
    return await this.ordersRepo.getList();
  }

  async getOrderById(id: string): Promise<OrderDto | string> {
    return await this.ordersRepo.getOrder(id);
  }

  async getOrdersByUserId(userId: string): Promise<OrderDto[]> {
    return await this.ordersRepo.getOrdersByUserId(userId);
  }

  // async createOrder(newOrder: NewOrderDto): Promise<OrderEntity | string> {
  //   const arr = await this.checkProductsQuantity(newOrder);
  //
  //   // TODO rewrite this logic via reduce
  //
  //   if (arr.length > 0) {
  //     let str = 'We have only:';
  //     arr.forEach((el) => {
  //       str += ` ${el.productInStock.quantity} available ${el.product.title}`;
  //     });
  //     str += ' on the stock now. Please change your order';
  //     return str;
  //   }
  //
  //   const totalAmount = newOrder.products.reduce(
  //     (total, product) => total + product.price * product.quantity,
  //     0,
  //   );
  //   const orderDto = new OrderDto();
  //   Object.assign(orderDto, newOrder);
  //   orderDto.totalAmount = totalAmount;
  //
  //   const createdOrder = await this.ordersRepo.addOrder(orderDto);
  //
  //   await this.createOrderItemsForOrder(newOrder, createdOrder);
  //
  //   return createdOrder;
  // }

  async updateOrder(id: string, updatedOrderDto: Partial<OrderEntity>) {
    return this.ordersRepo.updateOrder(id, updatedOrderDto);
  }

  async deleteOrder(orderId: string): Promise<OrderEntity | string> {
    const order = await this.ordersRepo.deleteOrder(orderId);
    await this.orderItemsRepo.deleteOrderItemsByOrderId(orderId);
    return order;
  }

  private async createOrderItemsForOrder(
    newOrder: NewOrderDto,
    createdOrder: OrderEntity,
  ) {
    newOrder.products.map((product) => {
      const newOrderItem = new OrderItemDto();
      const newData = {
        title: product.title,
        price: product.price,
        quantity: product.quantity,
      };
      Object.assign(newOrderItem, newData);
      newOrderItem.orderId = createdOrder.id;
      this.orderItemsRepo.addOrderItem(newOrderItem);
    });
  }

  // private async checkProductsQuantity(newOrder) {
  //   return Promise.all(
  //     newOrder.products.map(async (product) => {
  //       const productInStock = ProductDto.fromEntity(
  //         await this.productsRepo.getById(product.id),
  //       );
  //
  //       if (product.quantity > productInStock.quantity) {
  //         return {
  //           product: product,
  //           productInStock: productInStock,
  //         };
  //       }
  //     }),
  //   );
  // }
}
