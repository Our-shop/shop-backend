import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDto } from '../../shared/dto/product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  public async getAllProducts() {
    const entities = await this.productsService.getAllProducts();

    return ProductDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Get all active products' })
  @Get('active')
  public async getAllActiveProducts() {
    const entities = await this.productsService.getAllActiveProducts();

    return ProductDto.fromEntities(entities) || [];
  }

  @ApiOperation({ summary: 'Archive one product by id' })
  @Delete(':productId')
  public async archiveOneProduct(@Param('productId') id: string) {
    const entity = await this.productsService.archiveOneProduct(id);

    return ProductDto.fromEntity(entity) || null;
  }

  @ApiOperation({ summary: 'Archive many products by id array' })
  @Delete()
  public async archiveManyProducts(@Body() ids: string[]) {
    const entities = await this.productsService.archiveManyProducts(ids);

    return ProductDto.fromEntities(entities) || [];
  }
}
