import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@mikro-orm/nestjs';
import {EntityManager} from '@mikro-orm/postgresql';
import {ProductCategories} from '../../shared/enums/product-categories.enum';
import {ProductTypes} from '../../shared/enums/product-types.enum';
import {ToysService} from './toys.service';
import {ToyEntity} from './entities/toy.entity';
import {ToyDto} from './dtos/toy.dto';


describe('ToysService', () => {
    let service: ToysService;
    const toysEntities: ToyEntity[] = [];
    let toyEntity: ToyEntity;

    const mockEntityManager = {
        findAll: jest.fn().mockResolvedValue(toysEntities),
        findOne: jest.fn().mockResolvedValue(toyEntity),
        persistAndFlush: jest.fn(),
        flush: jest.fn(),
    };

    const mockToyDto: ToyDto = {
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

    const mockToysRepo = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        getAllToys: jest.fn().mockResolvedValue(toysEntities),
        getList: jest.fn(),
        addToy: jest.fn(dto => {
            return {
                id: dto.id,
                created: new Date(dto.created),
                updated: new Date(dto.updated),
                status: BasicStatuses.Active,
                recommendedAge: dto.recommendedAge,
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
        getToyById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(ErrorCodes.NotFound_Product);
            }
            return {
                id: id,
                ...mockToyDto,
            }
        }),
        editToy: jest.fn((id, dto) => {
            return {
                id,
                ...dto
            }
        }),
        deleteToy: jest.fn((id) => {
            const found = mockToysRepo.getToyById(id);
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
                ToysService,
                {
                    provide: getRepositoryToken(ToyEntity),
                    useValue: mockToysRepo,
                },
                {
                    provide: EntityManager,
                    useValue: mockEntityManager,
                },
            ],
        })
            .overrideProvider(ToysService)
            .useValue(mockToysRepo)
            .compile();

        service = module.get<ToysService>(ToysService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllToys()', () => {
        it('should return array',async () => {
            const result = await service.getAllToys();
            expect(result).toBeInstanceOf(Array);
        })

    })

    describe('getToyById()', () => {
        it('should return toy by id',async () => {
            const res = await service.addToy(mockToyDto);
            const entity = await service.getToyById(res.id);
            const dto = ToyDto.fromEntity(entity);

            expect(dto).toEqual(mockToyDto);
            expect(mockToysRepo.getToyById).toHaveBeenCalledWith(mockToyDto.id);

        })

        it('should return NotFoundException if toy not found', async () => {

            try {
                await service.getToyById(null);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }

            expect(mockToysRepo.getToyById).toHaveBeenCalledWith(null);
        });
    })

    describe('addToy()', () => {
        it('should create new toy product',async () => {
            const entity = await service.addToy(mockToyDto);
            const dto = ToyDto.fromEntity(entity);

            expect(dto).toEqual(mockToyDto);
            expect(mockToysRepo.addToy).toHaveBeenCalledWith(mockToyDto);
        })
    });



    describe('editToy()', () => {
        it('should update toy by id',async () => {
            const toyDto: ToyDto = {
                recommendedAge: '3+ years',
                title: 'Super toy',
                price: 23,
                description: 'Best product',
                image: 'url',
                quantity: 2,
                category: ProductCategories.Toys,
                type: ProductTypes.SoundToy,
                ...mockedBasicFields,
            };
            const data: Partial<ToyDto> = {
                quantity: 9,
            }
            const res = await service.editToy(toyDto.id, data);

            expect(res.quantity).toEqual(9);
            expect(mockToysRepo.editToy).toHaveBeenCalledWith(toyDto.id, data);
        })
    });

});
