import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dtos/product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  public async getProducts(): Promise<ProductDto[]> {
    return await this.productsService.getProducts();
  }

  @ApiOperation({ summary: 'Get product by id' })
  @Get(':productId')
  public async getProductById(@Param('productId') productId: string) {
    return await this.productsService.getProductById(productId);
  }

  @ApiOperation({ summary: 'Add product' })
  @Post()
  public async addProduct(@Body() dto: ProductDto) {
    return await this.productsService.addProduct(dto);
  }

  @ApiOperation({ summary: 'Edit product' })
  @Put(':productId')
  public async editProduct(
    @Param('productId') productId: string,
    @Body() dto: Partial<ProductDto>,
  ) {
    return await this.productsService.editProduct(productId, dto);
  }

  @ApiOperation({ summary: 'Archive product by id' })
  @Delete(':productId')
  public async archiveProduct(@Param('productId') productId: string) {
    return await this.productsService.archiveProduct(productId);
  }
}
