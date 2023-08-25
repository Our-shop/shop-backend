import { Injectable } from '@nestjs/common';
import { ToysRepo } from './repos/toys.repo';
import { ToyEntity } from './entities/toy.entity';
import { ToyDto } from './dtos/toy.dto';

@Injectable()
export class ToysService {
  constructor(private readonly toysRepo: ToysRepo) {}

  public async getAllToys(): Promise<ToyEntity[]> {
    return await this.toysRepo.getAll();
  }

  public async getToyById(foodId: string): Promise<ToyEntity> {
    return await this.toysRepo.getById(foodId);
  }

  public async addToy(dto: ToyDto): Promise<ToyEntity> {
    return await this.toysRepo.addOne(dto);
  }

  public async editToy(
    foodId: string,
    dto: Partial<ToyDto>,
  ): Promise<ToyEntity> {
    return await this.toysRepo.editOne(foodId, dto);
  }

  public async archiveToy(foodId: string): Promise<ToyEntity> {
    return await this.toysRepo.archiveOne(foodId);
  }
}
