import {I18nContext, I18nService} from 'nestjs-i18n';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {ProductCategories} from '../../shared/enums/product-categories.enum';
import {ProductTypes} from '../../shared/enums/product-types.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {FoodController} from './food.controller';
import {FoodService} from './food.service';
import {FoodEntity} from './entities/food.entity';
import {FoodDto} from './dtos/food.dto';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';

describe('FoodController', () => {
    let controller: FoodController;
    let service: FoodService;
    const foodEntities: FoodEntity[] = [];
    let i18n: I18nContext;

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

    const mockFoodService = {
        addFood: jest.fn(dto => {
            return {
                ...dto
            }
        }),
        getFoodList: jest.fn().mockResolvedValue(foodEntities),
        getFoodById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Product)
                );
            }
            return {
                id: id,
                ...mockFoodDto,
            }
        }),
        editFood: jest.fn((id, dto) => {
            const found = mockFoodService.getFoodById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Product)
                );
            }
            return Object.assign(found,dto);
        }),
        deleteFood: jest.fn((id) => {
            const found = mockFoodService.getFoodById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Product)
                );
            }
            found.status = BasicStatuses.Archived;
            return found;
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FoodController],
            providers: [
                FoodService,
                {
                    provide: I18nService,
                    useValue: i18n,
                },
            ],
        })
            .overrideProvider(FoodService)
            .useValue(mockFoodService)
            .compile();

        controller = module.get<FoodController>(FoodController);
        service = module.get<FoodService>(FoodService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET/food', () => {
        it('should return array of food', async () => {
            const result = await controller.getFoodList();
            expect(result).toBeInstanceOf(Array);
        });
    });

    describe('GET/food/:id', () => {
        it('should return food dto by id', async () => {
            const res = await controller.addFood(mockFoodDto);
            let result = await controller.getFoodById(res.id, i18n);

            expect(result).toEqual(mockFoodDto);
            expect(mockFoodService.getFoodById).toHaveBeenCalledWith(mockFoodDto.id);
        });

        it('should return error if food not found', async () => {
            try {
                await controller.getFoodById(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockFoodService.getFoodById).toHaveBeenCalledWith(null);
        });
    });

    describe('POST/food', () => {
        it('should create food product', async () => {
            const result = await controller.addFood(mockFoodDto);

            expect(result).toEqual(mockFoodDto);
            expect(mockFoodService.addFood).toHaveBeenCalledWith(mockFoodDto);
        });
    });

    describe('POST/:id', () => {
        it('should edit food product', async () => {
            const data: Partial<FoodDto> = {
                expirationDate: '07.07.2025'
            }
            const res = await controller.editFood(mockFoodDto.id, data);
            expect(res.expirationDate).toEqual('07.07.2025');

            expect(mockFoodService.editFood).toHaveBeenCalledWith(mockFoodDto.id, data);
        });
    });

})
