import { Injectable } from '@nestjs/common';
import { CharactersProfileRepo } from './repos/characters-profile.repo';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repo_characters_profile: CharactersProfileRepo,
  ) {}
}
