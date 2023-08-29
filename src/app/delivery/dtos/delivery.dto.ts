import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryEntity } from '../entities/delivery.entity';
import { IsString } from '@nestjs/class-validator';
import { ErrorCodes } from '../../../shared/enums/error-codes.enum';
import { IsMobilePhone, IsUUID } from 'class-validator';

export class DeliveryDto extends BasicDto {
    @ApiProperty({
        description: 'user_id',
    })
    @IsUUID()
    userId!: string;

    @ApiProperty({
        description: 'city',
    })
    @IsString({ message: ErrorCodes.FieldShouldBeString })
    city!: string;

    @ApiProperty({
        description: 'address',
    })
    @IsString({ message: ErrorCodes.FieldShouldBeString })
    address!: string;

    @ApiProperty({
        description: 'phone',
    })
    @IsString({ message: ErrorCodes.FieldShouldBeString })
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
