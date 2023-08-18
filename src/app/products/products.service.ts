import { Injectable } from '@nestjs/common';
import { ProductsRepo } from './repos/products.repo';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepo) {}
}
