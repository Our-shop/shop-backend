import { Module } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClothesEntity } from './entities/clothes.entity';
import { ClothesController } from './clothes.controller';
import { ClothesRepo } from './repos/clothes.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [ClothesEntity],
    }),
  ],
  controllers: [ClothesController],
  providers: [ClothesService, ClothesRepo],
  exports: [ClothesRepo],
})
export class ClothesModule {}
