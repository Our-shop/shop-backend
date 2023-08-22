import { Module } from '@nestjs/common';
import {MikroOrmModule} from '@mikro-orm/nestjs';
import {DeliveryEntity} from './entities/delivery.entity';
import {DeliveryService} from './delivery.service';
import {DeliveryController} from './delivery.controller';

@Module({
    imports: [
        MikroOrmModule.forFeature({
            entities: [DeliveryEntity],
        }),
    ],
    providers: [DeliveryService],
    controllers: [DeliveryController],
})
export class DeliveryModule {}
