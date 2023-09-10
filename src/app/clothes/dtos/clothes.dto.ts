import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../../shared/dto/product.dto';
import { ClothesEntity } from '../entities/clothes.entity';
import { IsString } from '@nestjs/class-validator';
import { ErrorCodes } from '../../../shared/enums/error-codes.enum';

export class ClothesDto extends ProductDto {
  @ApiProperty({
    description: 'Clothes size',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  size!: string;

  static fromEntity(entity?: ClothesEntity): ClothesDto {
    if (!entity) return;
    const it = super.fromEntity(entity) as ClothesDto;
    it.size = entity.size;

    return it;
  }

  static fromEntities(entities?: ClothesEntity[]): ClothesDto[] {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
