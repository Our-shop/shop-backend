import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ToysService } from './toys.service';
import { ToyDto } from './dtos/toy.dto';

@ApiTags('toys')
@Controller('toys')
export class ToysController {
  constructor(private readonly toysService: ToysService) {}

  @ApiOperation({ summary: 'Get all toys' })
  @Get()
  public async getAllToys() {
    const entities = await this.toysService.getAllToys();

    return ToyDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Get toy by id' })
  @Get(':toyId')
  public async getToyById(@Param('toyId') toyId: string) {
    const entity = await this.toysService.getToyById(toyId);

    return ToyDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Add toy' })
  @Post()
  public async addToy(@Body() dto: ToyDto) {
    const entity = await this.toysService.addToy(dto);

    return ToyDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Edit toy by id' })
  @Put(':toyId')
  public async editToy(
    @Param('toyId') toyId: string,
    @Body() dto: Partial<ToyDto>,
  ) {
    const entity = await this.toysService.editToy(toyId, dto);

    return ToyDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Archive toy by id' })
  @Delete(':toyId')
  public async archiveToy(@Param('toyId') toyId: string) {
    const entity = await this.toysService.archiveToy(toyId);

    return ToyDto.fromEntity(entity) || null;
  }
}
