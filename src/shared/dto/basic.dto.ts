import { ApiProperty } from '@nestjs/swagger';
import { BasicStatuses } from '../enums/basic-statuses.enum';

export abstract class BasicDto {
  @ApiProperty({
    description: 'Basic dto',
  })
  id!: string;

  @ApiProperty({
    description: 'Date created',
  })
  created!: Date;

  @ApiProperty({
    description: 'Date updated',
  })
  updated!: Date;

  @ApiProperty({
    description: 'User status',
    enum: BasicStatuses,
    default: BasicStatuses.Active,
  })
  status: BasicStatuses;
}
