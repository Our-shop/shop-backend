import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export abstract class UUIDDto {
  @ApiProperty({
    description: 'Entry id',
  })
  @IsUUID()
  id!: string;
}
