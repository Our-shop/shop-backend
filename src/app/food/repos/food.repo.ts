import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { FoodEntity } from '../entities/food.entity';
import { FoodDto } from '../dtos/food.dto';
import { ProductCategories } from '../../../shared/enums/product-categories.enum';

@Injectable()
export class FoodRepo extends EntityRepository<FoodEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, FoodEntity);
  }

  public async getAll(): Promise<FoodEntity[]> {
    return await this.findAll();
  }

  public async getById(id: string): Promise<FoodEntity> {
    return await this.findOne({ id });
  }

  public async addOne(dto: FoodDto): Promise<FoodEntity> {
    const newFood = await this.create({
      title: dto.title,
      price: dto.price,
      description: dto.description,
      image: dto.image,
      quantity: dto.quantity,
      category: ProductCategories.Food,
      type: dto.type,
      expirationDate: dto.expirationDate,
    });
    await this.entityManager.persistAndFlush(newFood);

    return newFood;
  }

  public async editOne(id: string, dto: Partial<FoodDto>): Promise<FoodEntity> {
    const foodToEdit = await this.findOne({ id });
    Object.assign(foodToEdit, dto);
    await this.entityManager.persistAndFlush(foodToEdit);

    return foodToEdit;
  }

  public async archiveOne(id: string): Promise<FoodEntity> {
    const foodToArchive = await this.findOne({ id });
    foodToArchive.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(foodToArchive);

    return foodToArchive;
  }
}
