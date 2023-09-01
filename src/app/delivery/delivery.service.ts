import { Injectable } from '@nestjs/common';
import {DeliveryRepo} from './repos/delivery.repo';
import {DeliveryDto} from './dtos/delivery.dto';
import {DeliveryEntity} from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
    constructor(private readonly deliveryRepo: DeliveryRepo) {}

    async getAllDeliveries(): Promise<DeliveryEntity[]> {
        return await this.deliveryRepo.getList();
    }

    async getDeliveryById(id: string): Promise<DeliveryEntity> {
        return await this.deliveryRepo.getDeliveryById(id);
    }

    async getDeliveriesByUserId(userId: string): Promise<DeliveryEntity[]> {
        return await this.deliveryRepo.getDeliveriesByUserId(userId);
    }

    async addDelivery(newDelivery: DeliveryDto): Promise<DeliveryEntity> {
        return await this.deliveryRepo.addDelivery(newDelivery);
    }

    async updateDelivery(id: string, updatedDeliveryDto: Partial<DeliveryDto>) {
        return await this.deliveryRepo.updateDelivery(id, updatedDeliveryDto);
    }

    async deleteDelivery(id: string): Promise<DeliveryEntity> {
        return await this.deliveryRepo.deleteDelivery(id);
    }
}



