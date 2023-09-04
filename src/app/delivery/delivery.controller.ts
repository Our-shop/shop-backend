import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { DeliveryDto } from './dtos/delivery.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiOperation({ summary: 'Get all deliveries' })
  @Get()
  async getAllDeliveries(): Promise<DeliveryDto[]> {
    const entities = await this.deliveryService.getAllDeliveries();

    const deliveries = DeliveryDto.fromEntities(entities);
    return deliveries || [];
  }

  @ApiOperation({ summary: 'Get all active deliveries' })
  @Get('/active')
  async getActive(): Promise<DeliveryDto[]> {
    const entities = await this.deliveryService.getAllActive();

    const deliveries = DeliveryDto.fromEntities(entities);
    return deliveries || [];
  }

  @ApiOperation({ summary: 'Get delivery by id' })
  @Get('/:deliveryId')
  async getDeliveryById(
    @Param('deliveryId') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<DeliveryDto | string> {
    try {
      const found = await this.deliveryService.getDeliveryById(id);
      return DeliveryDto.fromEntity(found);
    } catch {
      throw new NotFoundException(i18n.t(ErrorCodes.NotFound_Delivery));
    }
  }

  @ApiOperation({ summary: 'Get delivery by User id' })
  @Get('/user/:userId')
  async getDeliveriesByUserId(
    @Param('userId') userId: string,
    @I18n() i18n: I18nContext,
  ): Promise<DeliveryDto[]> {
    try {
      const found = await this.deliveryService.getDeliveriesByUserId(userId);
      return DeliveryDto.fromEntities(found);
    } catch {
      throw new NotFoundException(i18n.t(ErrorCodes.NotFound_User_Deliveries));
    }
  }

  @ApiOperation({ summary: 'Add delivery' })
  @Post()
  async addDelivery(@Body() newDelivery: DeliveryDto): Promise<DeliveryDto> {
    const res = await this.deliveryService.addDelivery(newDelivery);
    return DeliveryDto.fromEntity(res);
  }

  @ApiOperation({ summary: 'Edit delivery data' })
  @Put('/:deliveryId')
  async updateDelivery(
    @Param('deliveryId') id: string,
    @Body() updatedDeliveryDto: Partial<DeliveryDto>,
  ): Promise<DeliveryDto> {
    const res = await this.deliveryService.updateDelivery(
      id,
      updatedDeliveryDto,
    );
    return DeliveryDto.fromEntity(res);
  }

  @ApiOperation({ summary: 'Archive delivery by id' })
  @Delete('/:deliveryId')
  async deleteDelivery(
    @Param('deliveryId') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<DeliveryDto> {
    try {
      const res = await this.deliveryService.deleteDelivery(id);
      return DeliveryDto.fromEntity(res);
    } catch {
      throw new NotFoundException(i18n.t(ErrorCodes.NotFound_Delivery));
    }
  }
}
