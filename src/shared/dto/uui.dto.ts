import { ApiProperty } from '@nestjs/swagger';

export abstract class UUIDDto {
  @ApiProperty({
    description: 'Entry id',
  })
  id!: string;
}
