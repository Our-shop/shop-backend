import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ProductCategories } from '../../../shared/enums/product-categories.enum';
import { ToyEntity } from '../entities/toy.entity';
import { ToyDto } from '../dtos/toy.dto';

@Injectable()
export class ToysRepo extends EntityRepository<ToyEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, ToyEntity);
  }

  public async getAll(): Promise<ToyEntity[]> {
    return await this.findAll();
  }

  public async getById(id: string): Promise<ToyEntity> {
    return await this.findOne({ id });
  }

  public async addOne(dto: ToyDto): Promise<ToyEntity> {
    const newToy = await this.create({
      title: dto.title,
      price: dto.price,
      description: dto.description,
      image: dto.image,
      quantity: dto.quantity,
      category: ProductCategories.Food,
      type: dto.type,
      recommendedAge: dto.recommendedAge,
    });
    await this.entityManager.persistAndFlush(newToy);

    return newToy;
  }

  public async editOne(id: string, dto: Partial<ToyEntity>): Promise<ToyEntity> {
    const toyToEdit = await this.findOne({ id });
    Object.assign(toyToEdit, dto);
    await this.entityManager.persistAndFlush(toyToEdit);

    return toyToEdit;
  }
}
