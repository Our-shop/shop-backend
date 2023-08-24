import { Module } from '@nestjs/common';
import { ToysController } from './toys.controller';
import { ToysService } from './toys.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ToyEntity } from './entities/toy.entity';
import { ToysRepo } from './repos/toys.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [ToyEntity],
    }),
  ],
  controllers: [ToysController],
  providers: [ToysService, ToysRepo],
  exports: [ToysRepo],
})
export class ToysModule {}
