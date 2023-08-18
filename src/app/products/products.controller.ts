import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dtos/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public async getProducts(): Promise<ProductDto[]> {
    const entities = await this.productsService.getProducts();
    const products = ProductDto.fromEntities(entities);
    console.log('getProducts');

    return products || [];
  }

  @Get(':id')
  public async getProductById(@Param('id') id: string) {
    console.log('getProductById');
  }

  @Post(':id')
  public async createProduct(@Body() dto: ProductDto) {
    console.log('createProducts');
  }
}
