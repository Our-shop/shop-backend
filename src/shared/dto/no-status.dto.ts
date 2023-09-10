import { ApiProperty } from '@nestjs/swagger';

export abstract class NoStatusDto {
  @ApiProperty({
    description: 'No-status dto',
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
}
