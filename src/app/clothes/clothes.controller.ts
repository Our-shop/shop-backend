import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClothesService } from './clothes.service';
import { ClothesDto } from './dtos/clothes.dto';
import { ClothesEntity } from './entities/clothes.entity';

@ApiTags('clothes')
@Controller('clothes')
export class ClothesController {
  constructor(private readonly clothesService: ClothesService) {}

  @ApiOperation({ summary: 'Get clothes list' })
  @Get()
  public async getClothesList() {
    const entities = await this.clothesService.getClothesList();

    return ClothesDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Get clothes by id' })
  @Get(':clothesId')
  public async getClothesById(@Param('clothesId') clothesId: string) {
    const entity = await this.clothesService.getClothesById(clothesId);

    return ClothesDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Add clothes' })
  @Post()
  public async addFood(@Body() dto: ClothesDto) {
    const entity = await this.clothesService.addClothes(dto);

    return ClothesDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Edit clothes by id' })
  @Put(':clothesId')
  public async editClothes(
    @Param('clothesId') clothesId: string,
    @Body() dto: Partial<ClothesEntity>,
  ) {
    const entity = await this.clothesService.editClothes(clothesId, dto);

    return ClothesDto.fromEntity(entity) || null;
  }
}
