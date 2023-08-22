import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityManager, EntityRepository} from '@mikro-orm/postgresql';
import {OrderEntity} from '../entities/order.entity';
import {BasicStatuses} from '../../../shared/enums/basic-statuses.enum';
import {OrderDto} from '../dtos/order.dto';


@Injectable()
export class OrdersRepo extends EntityRepository<OrderEntity> {
    constructor(private readonly entityManager: EntityManager) {
        super(entityManager, OrderEntity);
    }

    async getList() {
        const entities = await this.findAll();
        const orders = OrderDto.fromEntities(entities);
        return orders || [];
    }

    async getOrder(id: string): Promise<OrderDto | string> {
        const found = await this.findOne({ id });
        if (!found) {
            throw new NotFoundException(`Order with id: ${id} not found`);
        }
        const order = OrderDto.fromEntity(found);
        return order || null;
    }

    async getOrdersByUserId(userId: string): Promise<OrderDto[]> {
        const found = await this.find({userId: userId});
        if (!found) {
            throw new NotFoundException(`Order with user id: ${userId} not found`);
        }
        const OrdersList = OrderDto.fromEntities(found);
        return OrdersList || null;
    }

    async addOrder(dto: OrderDto): Promise<OrderEntity> {
        const newOrder = await this.create({
            deliveryId: dto.deliveryId,
            userId: dto.userId,
            totalAmount: dto.totalAmount,
        });
        await this.entityManager.persistAndFlush(newOrder);
        return newOrder;
    }

    async updateOrder(
        id: string,
        updateData: Partial<OrderEntity>,
    ): Promise<OrderEntity | null> {
        const order = await this.findOne({ id });
        Object.assign(order, updateData);
        await this.getEntityManager().flush();
        return order ? order : null;
    }

    async deleteOrder(id: string): Promise<OrderEntity | string> {
        const found = await this.findOne({ id });
        found.status = BasicStatuses.Archived;
        await this.entityManager.persistAndFlush(found);
        return found;
    }
}