import {I18nContext, I18nService} from 'nestjs-i18n';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {ProductCategories} from '../../shared/enums/product-categories.enum';
import {ProductTypes} from '../../shared/enums/product-types.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {ClothesController} from './clothes.controller';
import {ClothesService} from './clothes.service';
import {ClothesEntity} from './entities/clothes.entity';
import {ClothesDto} from './dtos/clothes.dto';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';

describe('ClothesController', () => {
    let controller: ClothesController;
    let service: ClothesService;
    const clothesEntities: ClothesEntity[] = [];
    let i18n: I18nContext;

    const mockClothesDto: ClothesDto = {
        id: '90366a15-0176-4581-a124-357d479fe824',
        created: 1693305565000,
        updated: 1693305565000,
        status: BasicStatuses.Active,
        size: 'S',
        title: 'Super clothes',
        price: 20,
        description: 'Best product',
        image: 'url',
        quantity: 2,
        category: ProductCategories.Clothes,
        type: ProductTypes.Costume,
    }

    const mockClothesService = {
        addClothes: jest.fn(dto => {
            return {
                ...dto
            }
        }),
        getClothesList: jest.fn().mockResolvedValue(clothesEntities),
        getClothesById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Product)
                );
            }
            return {
                id: id,
                ...mockClothesDto,
            }
        }),
        editClothes: jest.fn((id, dto) => {
            const found = mockClothesService.getClothesById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Product)
                );
            }
            return Object.assign(found,dto);
        }),
        deleteClothes: jest.fn((id) => {
            const found = mockClothesService.getClothesById(id);
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
            controllers: [ClothesController],
            providers: [
                ClothesService,
                {
                    provide: I18nService,
                    useValue: i18n,
                },
            ],
        })
            .overrideProvider(ClothesService)
            .useValue(mockClothesService)
            .compile();

        controller = module.get<ClothesController>(ClothesController);
        service = module.get<ClothesService>(ClothesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET/clothes', () => {
        it('should return array of clothes', async () => {
            const result = await controller.getClothesList();
            expect(result).toBeInstanceOf(Array);
        });
    });

    describe('GET/clothes/:id', () => {
        it('should return clothes dto by id', async () => {
            const res = await controller.addClothes(mockClothesDto);
            let result = await controller.getClothesById(res.id, i18n);

            expect(result).toEqual(mockClothesDto);
            expect(mockClothesService.getClothesById).toHaveBeenCalledWith(mockClothesDto.id);
        });

        it('should return error if clothes not found', async () => {
            try {
                await controller.getClothesById(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockClothesService.getClothesById).toHaveBeenCalledWith(null);
        });
    });

    describe('POST/clothes', () => {
        it('should create clothes product', async () => {
            const result = await controller.addClothes(mockClothesDto);

            expect(result).toEqual(mockClothesDto);
            expect(mockClothesService.addClothes).toHaveBeenCalledWith(mockClothesDto);
        });
    });

    describe('POST/:id', () => {
        it('should edit clothes product', async () => {
            const data: Partial<ClothesDto> = {
                size: 'L',
            }
            const res = await controller.editClothes(mockClothesDto.id, data);
            expect(res.size).toEqual('L');

            expect(mockClothesService.editClothes).toHaveBeenCalledWith(mockClothesDto.id, data);
        });
    });
})
