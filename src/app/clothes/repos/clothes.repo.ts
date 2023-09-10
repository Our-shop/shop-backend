import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ClothesEntity } from '../entities/clothes.entity';
import { ClothesDto } from '../dtos/clothes.dto';
import { ProductCategories } from '../../../shared/enums/product-categories.enum';

@Injectable()
export class ClothesRepo extends EntityRepository<ClothesEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, ClothesEntity);
  }

  public async getAll(): Promise<ClothesEntity[]> {
    return await this.findAll();
  }

  public async getById(id: string): Promise<ClothesEntity> {
    return await this.findOne({ id });
  }

  public async addOne(dto: ClothesDto): Promise<ClothesEntity> {
    const newClothes = await this.create({
      title: dto.title,
      price: dto.price,
      description: dto.description,
      image: dto.image,
      quantity: dto.quantity,
      category: ProductCategories.Clothes,
      type: dto.type,
      size: dto.size,
    });
    await this.entityManager.persistAndFlush(newClothes);

    return newClothes;
  }

  public async editOne(
    id: string,
    dto: Partial<ClothesDto>,
  ): Promise<ClothesEntity> {
    const clothesToEdit = await this.findOne({ id: id });
    Object.assign(clothesToEdit, dto);
    await this.entityManager.persistAndFlush(clothesToEdit);

    return clothesToEdit;
  }
}
