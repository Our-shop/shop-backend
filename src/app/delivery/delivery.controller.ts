import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {DeliveryService} from './delivery.service';
import {DeliveryDto} from './dtos/delivery.dto';
import {DeliveryEntity} from './entities/delivery.entity';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @ApiOperation({ summary: 'Get all deliveries' })
    @Get()
    async getAllDeliveries(): Promise<DeliveryDto[]> {
        return await this.deliveryService.getAllDeliveries();
    }

    @ApiOperation({ summary: 'Get delivery by id' })
    @Get('/:deliveryId')
    async getDeliveryById(@Param('deliveryId') id: string): Promise<DeliveryDto | string> {
        return await this.deliveryService.getDeliveryById(id);
    }

    @ApiOperation({ summary: 'Get delivery by User id' })
    @Get('/user/:userId')
    async getDeliveriesByUserId(@Param('userId') userId: string): Promise<DeliveryDto[] | string> {
        return await this.deliveryService.getDeliveriesByUserId(userId);
    }

    @ApiOperation({ summary: 'Add delivery' })
    @Post()
    async addDelivery(@Body() newDelivery: DeliveryDto): Promise<DeliveryEntity> {
        return this.deliveryService.addDelivery(newDelivery);
    }

    @ApiOperation({ summary: 'Edit delivery data' })
    @Put('/:deliveryId')
    async updateDelivery(
        @Param('deliveryId') id: string,
        @Body() updatedDeliveryDto: Partial<DeliveryEntity>,
    ) {
        return this.deliveryService.updateDelivery(id, updatedDeliveryDto);
    }

    @ApiOperation({ summary: 'Archive delivery by id' })
    @Delete('/:deliveryId')
    async deleteDelivery(@Param('deliveryId') id: string): Promise<DeliveryEntity | string> {
        return this.deliveryService.deleteDelivery(id);
    }
}
