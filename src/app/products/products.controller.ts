import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharacterDto } from './dtos/character.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  public async findAll(): Promise<CharacterDto[]> {
    const entities = await this.charactersService.getAllCharacters();
    const characters = CharacterDto.fromEntities(entities);
    console.log('dddd');
    return characters || [];
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const entity = await this.charactersService.getOneCharacter(id);
    const character = CharacterDto.fromEntity(entity);
    return character || null;
  }

  @Post()
  public async fillDB(): Promise<any> {
    await this.charactersService.fillWithCharacters();
    return [];
  }
}
