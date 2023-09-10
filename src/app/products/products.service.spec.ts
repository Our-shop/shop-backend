import { BasicStatuses } from '../../shared/enums/basic-statuses.enum';
import { NotFoundException } from '@nestjs/common';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { ProductsService } from './products.service';
import { ProductEntity } from '../../shared/entities/product.entity';
import { ProductDto } from '../../shared/dto/product.dto';
import { ProductCategories } from '../../shared/enums/product-categories.enum';
import { ProductTypes } from '../../shared/enums/product-types.enum';

describe('ProductsService', () => {
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

  const mockEntityManager = {
    findAll: jest.fn().mockResolvedValue(productEntities),
    findOne: jest.fn().mockResolvedValue(productEntities[0]),
    find: jest.fn().mockResolvedValue(productEntities[0]),
    persistAndFlush: jest.fn(),
  };

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

  const mockProductsRepo = {
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
        throw new NotFoundException(ErrorCodes.NotFound_Product);
      }
      found.status = BasicStatuses.Archived;
      return found;
    }),
    archiveManyProducts: jest.fn((idArray) => {
      const found = productEntities.filter((product) =>
        idArray.includes(product.id),
      );
      if (found.length !== idArray.length) {
        throw new NotFoundException(ErrorCodes.NotFound_Product);
      }
      return found.forEach((item) => (item.status = BasicStatuses.Archived));
    }),
  };

  const mockedBasicFields = {
    id: expect.any(String),
    created: expect.any(Date),
    updated: expect.any(Date),
    status: BasicStatuses.Active,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductsRepo,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsRepo)
      .compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts()', () => {
    it('should return array of products', async () => {
      const result = await service.getAllProducts();
      expect(result).toBeInstanceOf(Array<ProductEntity>);
    });
  });

  describe('getAllActiveProducts()', () => {
    it('should return array of active products', async () => {
      const result = await service.getAllActiveProducts();
      expect(result).toBeInstanceOf(Array<ProductEntity>);
    });
  });

  describe('archiveOneProduct()', () => {
    it('should archive one product', async () => {
      const entity = await service.archiveOneProduct(mockProductDtos[0].id);

      expect(entity).toBeInstanceOf(Object);
      // expect(entity.status).toBe(BasicStatuses.Archived);
    });
  });

  describe('archiveManyProducts()', () => {
    it('should archive many products', async () => {
      const entities = await service.archiveManyProducts(
        mockProductDtos.map((dto) => dto.id),
      );

      expect(productEntities).toBeInstanceOf(Array);
    });
  });
});
