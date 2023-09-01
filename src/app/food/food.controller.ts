import {Controller, Get, Post, Param, Body, Put, NotFoundException} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FoodService } from './food.service';
import { FoodDto } from './dtos/food.dto';
import {I18n, I18nContext} from 'nestjs-i18n';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';

@ApiTags('food')
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @ApiOperation({ summary: 'Get food list' })
  @Get()
  public async getFoodList() {
    const entities = await this.foodService.getFoodList();

    return FoodDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Get food by id' })
  @Get(':foodId')
  public async getFoodById(
      @Param('foodId') foodId: string,
      @I18n() i18n: I18nContext
  ) {
    try {
      const entity = await this.foodService.getFoodById(foodId);

      return FoodDto.fromEntity(entity) || null;
    } catch {
      throw new NotFoundException(
          i18n.t(ErrorCodes.NotFound_Product)
      );
    }

  }

  @ApiOperation({ summary: 'Add food' })
  @Post()
  public async addFood(@Body() dto: FoodDto) {
    const entity = await this.foodService.addFood(dto);

    return FoodDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Edit food by id' })
  @Put(':foodId')
  public async editFood(
    @Param('foodId') foodId: string,
    @Body() dto: Partial<FoodDto>,
  ) {
    const entity = await this.foodService.editFood(foodId, dto);

    return FoodDto.fromEntity(entity) || null;
  }
}
