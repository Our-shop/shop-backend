import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { DeliveryEntity } from '../entities/delivery.entity';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { DeliveryDto } from '../dtos/delivery.dto';

@Injectable()
export class DeliveryRepo extends EntityRepository<DeliveryEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, DeliveryEntity);
  }

  async getList(): Promise<DeliveryEntity[]> {
    return await this.findAll();
  }

  async getActiveList(): Promise<DeliveryEntity[]> {
    return await this.find({ status: BasicStatuses.Active });
  }

  async getActiveByUserId(userId: string): Promise<DeliveryEntity[]> {
    return await this.find({ status: BasicStatuses.Active, userId: userId });
  }

  async getDeliveryById(id: string): Promise<DeliveryEntity> {
    return await this.findOne({ id });
  }

  async getDeliveriesByUserId(userId: string): Promise<DeliveryEntity[]> {
    return await this.find({ userId: userId });
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
    updateData: Partial<DeliveryDto>,
  ): Promise<DeliveryEntity | null> {
    const delivery = await this.findOne({ id });
    Object.assign(delivery, updateData);
    await this.getEntityManager().flush();
    return delivery ? delivery : null;
  }

  async deleteDelivery(id: string): Promise<DeliveryEntity> {
    const found = await this.findOne({ id });
    found.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(found);
    return found;
  }
}
