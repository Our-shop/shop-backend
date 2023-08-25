import { Injectable } from '@nestjs/common';
import { ClothesRepo } from './repos/clothes.repo';
import { ClothesEntity } from './entities/clothes.entity';
import { ClothesDto } from './dtos/clothes.dto';

@Injectable()
export class ClothesService {
  constructor(private readonly foodRepo: ClothesRepo) {}

  public async getClothesList(): Promise<ClothesEntity[]> {
    return await this.foodRepo.getAll();
  }

  public async getClothesById(clothesId: string): Promise<ClothesEntity> {
    return await this.foodRepo.getById(clothesId);
  }

  public async addClothes(dto: ClothesDto): Promise<ClothesEntity> {
    return await this.foodRepo.addOne(dto);
  }

  public async editClothes(
    clothesId: string,
    dto: Partial<ClothesEntity>,
  ): Promise<ClothesEntity> {
    return await this.foodRepo.editOne(clothesId, dto);
  }
}
