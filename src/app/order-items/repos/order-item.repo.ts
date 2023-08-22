import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityManager, EntityRepository} from '@mikro-orm/postgresql';
import {OrderItemEntity} from '../entities/order-item.entity';
import {BasicStatuses} from '../../../shared/enums/basic-statuses.enum';
import {OrderItemDto} from '../dtos/order-item.dto';

@Injectable()
export class OrderItemsRepo extends EntityRepository<OrderItemEntity> {
    constructor(private readonly entityManager: EntityManager) {
        super(entityManager, OrderItemEntity);
    }

    async getList() {
        const entities = await this.findAll();
        const orderItems = OrderItemDto.fromEntities(entities);
        return orderItems || [];
    }

    async getOrderItem(id: string): Promise<OrderItemDto | string> {
        const found = await this.findOne({ id });
        if (!found) {
            throw new NotFoundException(`Order item with id: ${id} not found`);
        }
        const orderItem = OrderItemDto.fromEntity(found);
        return orderItem || null;
    }

    async addOrderItem(dto: OrderItemDto): Promise<OrderItemEntity> {
        const newOrderItem = await this.create({
            orderId: dto.orderId,
            price: dto.price,
            quantity: dto.quantity,
            title: dto.title,
        });
        await this.entityManager.persistAndFlush(newOrderItem);
        return newOrderItem;
    }

    async updateOrderItem(
        id: string,
        updateData: Partial<OrderItemEntity>,
    ): Promise<OrderItemEntity | null> {
        const orderItem = await this.findOne({ id });
        Object.assign(orderItem, updateData);
        await this.entityManager.flush();
        return orderItem ? orderItem : null;
    }

    async deleteOrderItem(id: string): Promise<OrderItemEntity | string> {
        const found = await this.findOne({ id });
        found.status = BasicStatuses.Archived;
        await this.entityManager.persistAndFlush(found);
        return found;
    }

    async deleteOrderItemsByOrderId(orderId: string):Promise<OrderItemEntity[] | string> {
        const foundItems = await this.find({orderId: orderId});
        foundItems.map((item) => {
            item.status = BasicStatuses.Archived;
            this.entityManager.persistAndFlush(item);
        });
        return foundItems;
    }
}
