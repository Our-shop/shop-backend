import { ApiProperty } from '@nestjs/swagger';
import { BasicStatuses } from '../enums/basic-statuses.enum';
import { IsEnum, IsNumber, IsUUID} from 'class-validator';

export abstract class BasicDto {
  @ApiProperty({
    description: 'Basic dto',
  })
  id!: string;

  @ApiProperty({
    description: 'Date created',
  })
  created!: number;

  @ApiProperty({
    description: 'Date updated',
  })
  updated!: number;

  @ApiProperty({
    description: 'User status',
    enum: BasicStatuses,
    default: BasicStatuses.Active,
  })
  status: BasicStatuses;
}
