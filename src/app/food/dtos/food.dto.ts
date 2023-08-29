import { ApiProperty } from '@nestjs/swagger';
import { FoodEntity } from '../entities/food.entity';
import { ProductDto } from '../../../shared/dto/product.dto';
import { IsString } from '@nestjs/class-validator';
import { ErrorCodes } from '../../../shared/enums/error-codes.enum';

export class FoodDto extends ProductDto {
  @ApiProperty({
    description: 'Food expiration date',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  expirationDate!: string;

  static fromEntity(entity?: FoodEntity): FoodDto {
    if (!entity) return;
    const it = super.fromEntity(entity) as FoodDto;
    it.expirationDate = entity.expirationDate;

    return it;
  }

  static fromEntities(entities?: FoodEntity[]): FoodDto[] {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
