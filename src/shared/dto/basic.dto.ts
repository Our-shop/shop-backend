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
  created!: number;

  @ApiProperty({
    description: 'Date updated',
  })
  updated!: number;

  @ApiProperty({
    description: 'Status',
    enum: BasicStatuses,
  })
  status: BasicStatuses;
}
