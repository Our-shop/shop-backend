import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../../shared/dto/product.dto';
import { ToyEntity } from '../entities/toy.entity';
import {IsString} from '@nestjs/class-validator';
import {ErrorCodes} from '../../../shared/enums/error-codes.enum';

export class ToyDto extends ProductDto {
  @ApiProperty({
    description: 'Toy recommended age',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  recommendedAge!: string;

  static fromEntity(entity?: ToyEntity): ToyDto {
    if (!entity) return;
    const it = super.fromEntity(entity) as ToyDto;
    it.recommendedAge = entity.recommendedAge;

    return it;
  }

  static fromEntities(entities?: ToyEntity[]): ToyDto[] {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
