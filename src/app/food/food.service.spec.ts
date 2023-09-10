import {ClothesService} from '../clothes/clothes.service';
import {ClothesEntity} from '../clothes/entities/clothes.entity';
import {ClothesDto} from '../clothes/dtos/clothes.dto';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {ProductCategories} from '../../shared/enums/product-categories.enum';
import {ProductTypes} from '../../shared/enums/product-types.enum';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@mikro-orm/nestjs';
import {EntityManager} from '@mikro-orm/postgresql';
import {FoodService} from './food.service';
import {FoodEntity} from './entities/food.entity';
import {FoodDto} from './dtos/food.dto';

describe('FoodService', () => {
    let service: FoodService;
    const foodEntities: FoodEntity[] = [];
    let foodEntity: FoodEntity;

    const mockEntityManager = {
        findAll: jest.fn().mockResolvedValue(foodEntities),
        findOne: jest.fn().mockResolvedValue(foodEntity),
        persistAndFlush: jest.fn(),
        flush: jest.fn(),
    };

    const mockFoodDto: FoodDto = {
        id: '90366a15-0176-4581-a124-357d479fe824',
        created: 1693305565000,
        updated: 1693305565000,
        status: BasicStatuses.Active,
        expirationDate: '20.05.2024',
        title: 'Dry food for Dog',
        price: 29,
        description: 'Best product',
        image: 'url',
        quantity: 8,
        category: ProductCategories.Food,
        type: ProductTypes.DryFood,
    }

    const mockFoodRepo = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        getFoodList: jest.fn().mockResolvedValue(foodEntities),
        getList: jest.fn(),
        addFood: jest.fn(dto => {
            return {
                id: dto.id,
                created: new Date(dto.created),
                updated: new Date(dto.updated),
                status: BasicStatuses.Active,
                expirationDate: dto.expirationDate,
                title: dto.title,
                price: dto.price,
                description: dto.description,
                image: dto.image,
                quantity: dto.quantity,
                category: dto.category,
                type: dto.type,
            }
        }),
        create: jest.fn().mockImplementation(dto => dto),
        getFoodById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(ErrorCodes.NotFound_Product);
            }
            return {
                id: id,
                ...mockFoodDto,
            }
        }),
        editFood: jest.fn((id, dto) => {
            return {
                id,
                ...dto
            }
        }),
        deleteFood: jest.fn((id) => {
            const found = mockFoodRepo.getFoodById(id);
            if (!found) {
                throw new NotFoundException(ErrorCodes.NotFound_Product);
            }
            found.status = BasicStatuses.Archived;
            return found;
        })
    }

    const mockedBasicFields = {
        id: expect.any(String),
        created: expect.any(Date),
        updated: expect.any(Date),
        status: BasicStatuses.Active,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FoodService,
                {
                    provide: getRepositoryToken(FoodEntity),
                    useValue: mockFoodRepo,
                },
                {
                    provide: EntityManager,
                    useValue: mockEntityManager,
                },
            ],
        })
            .overrideProvider(FoodService)
            .useValue(mockFoodRepo)
            .compile();

        service = module.get<FoodService>(FoodService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getFoodList()', () => {
        it('should return array',async () => {
            const result = await service.getFoodList();
            expect(result).toBeInstanceOf(Array);
        })

    })

    describe('getFoodById()', () => {
        it('should return food by id',async () => {
            const res = await service.addFood(mockFoodDto);
            const entity = await service.getFoodById(res.id);
            const dto = FoodDto.fromEntity(entity);

            expect(dto).toEqual(mockFoodDto);
            expect(mockFoodRepo.getFoodById).toHaveBeenCalledWith(mockFoodDto.id);

        })

        it('should return NotFoundException if food not found', async () => {

            try {
                await service.getFoodById(null);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }

            expect(mockFoodRepo.getFoodById).toHaveBeenCalledWith(null);
        });
    })

    describe('addFood()', () => {
        it('should create new food product',async () => {
            const entity = await service.addFood(mockFoodDto);
            const dto = FoodDto.fromEntity(entity)

            expect(dto).toEqual(mockFoodDto);
            expect(mockFoodRepo.addFood).toHaveBeenCalledWith(mockFoodDto);
        })
    });

    describe('editFood()', () => {
        it('should update food by id',async () => {
            const foodDto: FoodDto = {
                expirationDate: '08.08.2025',
                title: 'Super food',
                price: 22,
                description: 'Best product',
                image: 'url',
                quantity: 7,
                category: ProductCategories.Food,
                type: ProductTypes.DryFood,
                ...mockedBasicFields,
            };
            const data: Partial<FoodDto> = {
                expirationDate: '09.08.2025',
            }
            const res = await service.editFood(foodDto.id, data);

            expect(res.expirationDate).toEqual('09.08.2025');
            expect(mockFoodRepo.editFood).toHaveBeenCalledWith(foodDto.id, data);
        })
    });

});
