import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FoodService } from './food.service';
import { FoodDto } from './dtos/food.dto';
import { FoodEntity } from './entities/food.entity';

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
  public async getProductById(@Param('foodId') foodId: string) {
    const entity = await this.foodService.getFoodById(foodId);

    return FoodDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Add food' })
  @Post()
  public async addFood(@Body() dto: FoodDto) {
    const entity = await this.foodService.addFood(dto);

    return FoodDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Edit food by id' })
  @Put(':foodId')
  public async editProduct(
    @Param('foodId') foodId: string,
    @Body() dto: Partial<FoodEntity>,
  ) {
    const entity = await this.foodService.editFood(foodId, dto);

    return FoodDto.fromEntity(entity) || null;
  }
}
