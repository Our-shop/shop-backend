import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasicStatuses } from '../../shared/enums/basic-statuses.enum';
import { ProductCategories } from '../../shared/enums/product-categories.enum';
import { ProductTypes } from '../../shared/enums/product-types.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from '../../shared/entities/product.entity';
import { ProductDto } from '../../shared/dto/product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  const productEntities: ProductEntity[] = [
    {
      id: '90366a15-0176-4581-a124-357d479fe824',
      created: new Date(1693305565000),
      updated: new Date(1693305565000),
      status: BasicStatuses.Active,
      title: 'First test product',
      price: 21.5,
      description: 'Best product 1',
      image: 'url',
      quantity: 10,
      category: ProductCategories.Food,
      type: ProductTypes.Sticks,
    },
    {
      id: '90366a15-0176-4581-a124-357d479fe824',
      created: new Date(1693305565000),
      updated: new Date(1693305565000),
      status: BasicStatuses.Active,
      title: 'Second test product',
      price: 21.5,
      description: 'Best product 2',
      image: 'url',
      quantity: 10,
      category: ProductCategories.Clothes,
      type: ProductTypes.Sweater,
    },
    {
      id: '90366a15-0176-4581-a124-357d479fe824',
      created: new Date(1693305565000),
      updated: new Date(1693305565000),
      status: BasicStatuses.Archived,
      title: 'Third test product',
      price: 21.5,
      description: 'Best product 3',
      image: 'url',
      quantity: 10,
      category: ProductCategories.Toys,
      type: ProductTypes.Ball,
    },
  ];
  let i18n: I18nContext;

  const mockProductDtos: ProductDto[] = [
    {
      id: '90366a15-0176-4581-a124-357d479fe824',
      created: 1693305565000,
      updated: 1693305565000,
      status: BasicStatuses.Active,
      title: 'First test product',
      price: 21.5,
      description: 'Best product 1',
      image: 'url',
      quantity: 10,
      category: ProductCategories.Food,
      type: ProductTypes.Sticks,
    },
    {
      id: '90366a15-0176-4581-a124-357d479fe824',
      created: 1693305565000,
      updated: 1693305565000,
      status: BasicStatuses.Active,
      title: 'Second test product',
      price: 21.5,
      description: 'Best product 2',
      image: 'url',
      quantity: 10,
      category: ProductCategories.Clothes,
      type: ProductTypes.Sweater,
    },
    {
      id: '90366a15-0176-4581-a124-357d479fe824',
      created: 1693305565000,
      updated: 1693305565000,
      status: BasicStatuses.Archived,
      title: 'Third test product',
      price: 21.5,
      description: 'Best product 3',
      image: 'url',
      quantity: 10,
      category: ProductCategories.Toys,
      type: ProductTypes.Ball,
    },
  ];

  const mockProductsService = {
    getAllProducts: jest.fn().mockResolvedValue(productEntities),
    getAllActiveProducts: jest
      .fn()
      .mockResolvedValue(
        productEntities.filter(
          (product) => product.status === BasicStatuses.Active,
        ),
      ),
    archiveOneProduct: jest.fn((id) => {
      const found = productEntities.find((product) => product.id === id);
      if (!found) {
        throw new NotFoundException(i18n.t(ErrorCodes.NotFound_Product));
      }
      found.status = BasicStatuses.Archived;

      return found;
    }),
    archiveManyProducts: jest.fn((idArray) => {
      const found = productEntities.filter((product) =>
        idArray.includes(product.id),
      );
      if (found.length !== idArray.length) {
        throw new NotFoundException(i18n.t(ErrorCodes.NotFound_Product));
      }

      return found.forEach((item) => (item.status = BasicStatuses.Archived));
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: I18nService,
          useValue: i18n,
        },
      ],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET/products', () => {
    it('should return array of products', async () => {
      const result = await controller.getAllProducts();
      expect(result).toBeInstanceOf(Array<ProductDto>);
    });
  });

  describe('GET/products/active', () => {
    it('should return array of active products', async () => {
      const result = await controller.getAllActiveProducts();
      expect(result).toBeInstanceOf(Array<ProductDto>);
    });
  });

  describe('DELETE/products/:productId', () => {
    it('should archive product by id', async () => {
      const result = await controller.archiveOneProduct(mockProductDtos[0].id);

      expect(result).toBeInstanceOf(ProductDto);
      expect(result.status).toBe(BasicStatuses.Archived);
    });

    it('should return error if product not found', async () => {
      try {
        await controller.archiveOneProduct(null);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(mockProductsService.archiveOneProduct).toHaveBeenCalledWith(null);
    });
  });

  describe('DELETE/products/', () => {
    it('should archive product by id', async () => {
      const result = await controller.archiveManyProducts(
        mockProductDtos.map((dto) => dto.id),
      );

      expect(result).toBeInstanceOf(Array<ProductDto>);
    });

    it('should return error if any product not found', async () => {
      try {
        await controller.archiveManyProducts(null);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(mockProductsService.archiveOneProduct).toHaveBeenCalledWith(null);
    });
  });
});
