import {BasicDto} from '../../../shared/dto/basic.dto';
import {ApiProperty} from '@nestjs/swagger';
import {DeliveryEntity} from '../entities/delivery.entity';

export class DeliveryDto extends BasicDto {
    @ApiProperty({
        description: 'user_id',
    })
    userId!: string;

    @ApiProperty({
        description: 'city',
    })
    city!: string;

    @ApiProperty({
        description: 'address',
    })
    address!: string;

    @ApiProperty({
        description: 'phone',
    })
    phone!: string;

    static fromEntity(entity?: DeliveryEntity) {
        if (!entity) {
            return;
        }
        const it = new DeliveryDto();
        it.id = entity.id;
        it.created = entity.created.valueOf();
        it.updated = entity.updated.valueOf();
        it.status = entity.status;
        it.city = entity.city;
        it.phone = entity.phone;
        it.address = entity.address;
        it.userId = entity.userId;

        return it;
    }

    static fromEntities(entities?: DeliveryEntity[]) {
        if (!entities?.map) {
            return;
        }
        return entities.map((entity) => this.fromEntity(entity));
    }
}
