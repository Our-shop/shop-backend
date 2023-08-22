import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityManager, EntityRepository} from '@mikro-orm/postgresql';
import {DeliveryEntity} from '../entities/delivery.entity';
import {BasicStatuses} from '../../../shared/enums/basic-statuses.enum';
import {DeliveryDto} from '../dtos/delivery.dto';

@Injectable()
export class DeliveryRepo extends EntityRepository<DeliveryEntity> {
    constructor(private readonly entityManager: EntityManager) {
        super(entityManager, DeliveryEntity);
    }

    async getList() {
        const entities = await this.findAll();
        const deliveries = DeliveryDto.fromEntities(entities);
        return deliveries || [];
    }

    async getDeliveryById(id: string): Promise<DeliveryDto | string> {
        const found = await this.findOne({ id });
        if (!found) {
            throw new NotFoundException(`Delivery with id: ${id} not found`);
        }
        const delivery = DeliveryDto.fromEntity(found);
        return delivery || null;
    }

    async getDeliveriesByUserId(userId: string): Promise<DeliveryDto[]> {
        const found = await this.find({userId: userId});
        if (!found) {
            throw new NotFoundException(`Delivery with user id: ${userId} not found`);
        }
        const DeliveryList = DeliveryDto.fromEntities(found);
        return DeliveryList || null;
    }

    async addDelivery(dto: DeliveryDto): Promise<DeliveryEntity> {
        const newDelivery = await this.create({
            userId: dto.userId,
            phone: dto.phone,
            address: dto.address,
            city: dto.city,
        });
        await this.entityManager.persistAndFlush(newDelivery);
        return newDelivery;
    }

    async updateDelivery(
        id: string,
        updateData: Partial<DeliveryEntity>,
    ): Promise<DeliveryEntity | null> {
        const delivery = await this.findOne({ id });
        Object.assign(delivery, updateData);
        await this.getEntityManager().flush();
        return delivery ? delivery : null;
    }

    async deleteDelivery(id: string): Promise<DeliveryEntity | string> {
        const found = await this.findOne({ id });
        found.status = BasicStatuses.Archived;
        await this.entityManager.persistAndFlush(found);
        return found;
    }

}
