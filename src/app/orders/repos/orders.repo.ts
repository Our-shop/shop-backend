import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityRepository} from '@mikro-orm/postgresql';
import {OrderEntity} from '../entities/order.entity';
import {BasicStatuses} from '../../../shared/enums/basic-statuses.enum';
import {OrderDto} from '../dtos/order.dto';


@Injectable()
export class OrdersRepo extends EntityRepository<OrderEntity> {
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

    async addOrder(dto: OrderDto): Promise<OrderEntity> {
        const newOrder = this.create({
            deliveryId: dto.deliveryId,
            totalAmount: dto.totalAmount,
        });
        await this.getEntityManager().persistAndFlush(newOrder);
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
        await this.getEntityManager().persistAndFlush(found);
        return found;
    }
}
