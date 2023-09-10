import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FoodRepo } from './repos/food.repo';
import { FoodEntity } from './entities/food.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [FoodEntity],
    }),
  ],
  controllers: [FoodController],
  providers: [FoodService, FoodRepo],
  exports: [FoodRepo],
})
export class FoodModule {}
