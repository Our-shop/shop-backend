import { Controller, Get, Post, Param, Body, Put, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClothesService } from './clothes.service';
import { ClothesDto } from './dtos/clothes.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';

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
  public async getClothesById(
      @Param('clothesId') clothesId: string,
      @I18n() i18n: I18nContext
  ) {
    try {
      const entity = await this.clothesService.getClothesById(clothesId);

      return ClothesDto.fromEntity(entity) || null;
    } catch {
      throw new NotFoundException(
          i18n.t(ErrorCodes.NotFound_Product)
      );
    }

  }

  @ApiOperation({ summary: 'Add clothes' })
  @Post()
  public async addClothes(@Body() dto: ClothesDto) {
    const entity = await this.clothesService.addClothes(dto);

    return ClothesDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Edit clothes by id' })
  @Put(':clothesId')
  public async editClothes(
    @Param('clothesId') clothesId: string,
    @Body() dto: Partial<ClothesDto>,
  ) {
    const entity = await this.clothesService.editClothes(clothesId, dto);

    return ClothesDto.fromEntity(entity) || null;
  }
}
