/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ApiRepo } from './repos/api.repo';
import { ConfigModule } from '@nestjs/config';
import { CharactersProfileRepo } from './repos/characters-profile.repo';
import { CharactersProfileEntity } from './entities/charactersProfile.entity';
import { ApiEntity } from './entities/api.entity';
import { CharacterEntity } from './entities/product.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";


@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [CharactersProfileEntity, CharacterEntity],
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ApiRepo, CharactersProfileRepo],
})
export class CharactersModule {}
