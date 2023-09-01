import {Test, TestingModule} from '@nestjs/testing';
import {I18nContext, I18nService} from 'nestjs-i18n';
import {ToysController} from './toys.controller';
import {ToysService} from './toys.service';
import {ToyDto} from './dtos/toy.dto';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {ProductCategories} from '../../shared/enums/product-categories.enum';
import {ProductTypes} from '../../shared/enums/product-types.enum';
import {ToyEntity} from './entities/toy.entity';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';

describe('ToysController', () => {
    let controller: ToysController;
    let service: ToysService;
    const toysEntities: ToyEntity[] = [];
    let i18n: I18nContext;

    const mockToysDto: ToyDto = {
        id: '90366a15-0176-4581-a124-357d479fe824',
        created: 1693305565000,
        updated: 1693305565000,
        status: BasicStatuses.Active,
        recommendedAge: '3 years',
        title: 'Super toy',
        price: 20,
        description: 'Best product',
        image: 'url',
        quantity: 3,
        category: ProductCategories.Toys,
        type: ProductTypes.Ball,
    }

    const mockToysService = {
        addToy: jest.fn(dto => {
            return {
                ...dto
            }
        }),
        getAllToys: jest.fn().mockResolvedValue(toysEntities),
        getToyById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Product)
                );
            }
            return {
                id: id,
                ...mockToysDto,
            }
        }),
        editToy: jest.fn((id, dto) => {
            const found = mockToysService.getToyById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Product)
                );
            }
            return Object.assign(found,dto);
        }),
        deleteToy: jest.fn((id) => {
            const found = mockToysService.getToyById(id);
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
            controllers: [ToysController],
            providers: [
                ToysService,
                {
                    provide: I18nService,
                    useValue: i18n,
                },
            ],
        })
            .overrideProvider(ToysService)
            .useValue(mockToysService)
            .compile();

        controller = module.get<ToysController>(ToysController);
        service = module.get<ToysService>(ToysService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET/toys', () => {
        it('should return array of toys', async () => {
            const result = await controller.getAllToys();
            expect(result).toBeInstanceOf(Array);
        });
    });

    describe('GET/toys/:id', () => {
        it('should return toy dto by id', async () => {
            const res = await controller.addToy(mockToysDto);
            let result = await controller.getToyById(res.id, i18n);

            expect(result).toEqual(mockToysDto);
            expect(mockToysService.getToyById).toHaveBeenCalledWith(mockToysDto.id);
        });

        it('should return error if toy not found', async () => {

            try {
                await controller.getToyById(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockToysService.getToyById).toHaveBeenCalledWith(null);
        });
    });

    describe('POST/toys', () => {
        it('should create toy product', async () => {
            const result = await controller.addToy(mockToysDto);

            expect(result).toEqual(mockToysDto);
            expect(mockToysService.addToy).toHaveBeenCalledWith(mockToysDto);
        });
    });

    describe('POST/:id', () => {
        it('should edit toy product', async () => {

            const data: Partial<ToyDto> = {
                recommendedAge: '0.5+ years',
            }
            const res = await controller.editToy(mockToysDto.id, data);
            expect(res.recommendedAge).toEqual('0.5+ years');

            expect(mockToysService.editToy).toHaveBeenCalledWith(mockToysDto.id, data);
        });
    });


})
