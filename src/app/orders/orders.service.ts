import { Injectable } from '@nestjs/common';
import { OrdersRepo } from './repos/orders.repo';
import { OrderEntity } from './entities/order.entity';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';
import { ProductsRepo } from '../../shared/repos/products.repo';
import { OrderDto } from './dtos/order.dto';
import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepo,
    private readonly orderItemsRepo: OrderItemsRepo,
    private readonly productsRepo: ProductsRepo,
    private readonly tokensRepo: RefreshTokenRepo,
    private readonly jwtService: JwtService,
  ) {}

  // ORDERS
  public async getAllOrders(): Promise<OrderEntity[]> {
    return await this.ordersRepo.getAllOrders();
  }

  public async getOrderById(id: string): Promise<OrderEntity> {
    return await this.ordersRepo.getOrderById(id);
  }

  public async getOrdersByUserId(userId: string): Promise<OrderEntity[]> {
    return await this.ordersRepo.getOrdersByUserId(userId);
  }

  public async makeOrder(dto: OrderDto): Promise<OrderEntity | string> {
    const orderItems = await this.orderItemsRepo.getAllByOrderId(dto.id);
    const products = await this.productsRepo.getLackingProducts(orderItems);

    if (products.length) {
      return (
        products.reduce((result, product) => {
          return result + `| ${product.quantity} items of ${product.title} `;
        }, 'We have only ') + '| on stock now. Please, change your order'
      );
    }

    const orderedProducts = await this.productsRepo.orderProducts(orderItems);
    const editedItems = await this.orderItemsRepo.editOrderItems(
      dto.id,
      orderedProducts,
    );
    dto.totalAmount = editedItems.reduce((result, item) => {
      return result + item.productPrice * item.productQuantity;
    }, 0);

    return await this.ordersRepo.makeOrder(dto);
  }

  public async archiveOrder(id: string): Promise<OrderEntity> {
    return await this.ordersRepo.archiveOrder(id);
  }

  // CARTS
  public async getAllCarts(): Promise<OrderEntity[]> {
    return await this.ordersRepo.getAllCarts();
  }

  public async getCartById(id: string): Promise<OrderEntity> {
    return await this.ordersRepo.getCartById(id);
  }

  public async getCartByUserId(userId: string): Promise<OrderEntity> {
    return await this.ordersRepo.getCartByUserId(userId);
  }

  public async getActiveCart(token: string): Promise<OrderEntity> {
    const tokenData: any = await this.jwtService.decode(token);

    return await this.ordersRepo.getCartByUserId(tokenData.id);
  }

  public async editCartDiscount(
    id: string,
    dto: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    return await this.ordersRepo.editCartDiscount(id, dto);
  }
}
