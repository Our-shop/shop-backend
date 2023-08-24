import { Injectable } from '@nestjs/common';
import { FoodRepo } from './repos/food.repo';
import { FoodDto } from './dtos/food.dto';
import { FoodEntity } from './entities/food.entity';

@Injectable()
export class FoodService {
  constructor(private readonly foodRepo: FoodRepo) {}

  public async getFoodList(): Promise<FoodEntity[]> {
    return await this.foodRepo.getAll();
  }

  public async getFoodById(foodId: string): Promise<FoodEntity> {
    return await this.foodRepo.getById(foodId);
  }

  public async addFood(dto: FoodDto): Promise<FoodEntity> {
    return await this.foodRepo.addOne(dto);
  }

  public async editFood(
    foodId: string,
    dto: Partial<FoodDto>,
  ): Promise<FoodEntity> {
    return await this.foodRepo.editOne(foodId, dto);
  }

  public async archiveFood(foodId: string): Promise<FoodEntity> {
    return await this.foodRepo.archiveOne(foodId);
  }
}
