import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@mikro-orm/nestjs';
import {EntityManager} from '@mikro-orm/postgresql';
import {ClothesService} from './clothes.service';
import {ClothesEntity} from './entities/clothes.entity';
import {ProductCategories} from '../../shared/enums/product-categories.enum';
import {ProductTypes} from '../../shared/enums/product-types.enum';
import {ClothesDto} from './dtos/clothes.dto';


describe('ClothesService', () => {
    let service: ClothesService;
    const clothesEntities: ClothesEntity[] = [];
    let clothesEntity: ClothesEntity;

    const mockEntityManager = {
        findAll: jest.fn().mockResolvedValue(clothesEntities),
        findOne: jest.fn().mockResolvedValue(clothesEntity),
        persistAndFlush: jest.fn(),
        flush: jest.fn(),
    };

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

    const mockClothesRepo = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        getClothesList: jest.fn().mockResolvedValue(clothesEntities),
        getList: jest.fn(),
        addClothes: jest.fn(dto => {
            return {
                id: dto.id,
                created: new Date(dto.created),
                updated: new Date(dto.updated),
                status: BasicStatuses.Active,
                size: dto.size,
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
        getClothesById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(ErrorCodes.NotFound_Product);
            }
            return {
                id: id,
                ...mockClothesDto,
            }
        }),
        editClothes: jest.fn((id, dto) => {
            return {
                id,
                ...dto
            }
        }),
        deleteClothes: jest.fn((id) => {
            const found = mockClothesRepo.getClothesById(id);
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
                ClothesService,
                {
                    provide: getRepositoryToken(ClothesEntity),
                    useValue: mockClothesRepo,
                },
                {
                    provide: EntityManager,
                    useValue: mockEntityManager,
                },
            ],
        })
            .overrideProvider(ClothesService)
            .useValue(mockClothesRepo)
            .compile();

        service = module.get<ClothesService>(ClothesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getClothesList()', () => {
        it('should return array',async () => {
            const result = await service.getClothesList();
            expect(result).toBeInstanceOf(Array);
        })

    })

    describe('getClothesById()', () => {
        it('should return clothes by id',async () => {
            const res = await service.addClothes(mockClothesDto);
            const entity = await service.getClothesById(res.id);
            const dto = ClothesDto.fromEntity(entity);

            expect(dto).toEqual(mockClothesDto);
            expect(mockClothesRepo.getClothesById).toHaveBeenCalledWith(mockClothesDto.id);

        })

        it('should return NotFoundException if clothes not found', async () => {

            try {
                await service.getClothesById(null);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }

            expect(mockClothesRepo.getClothesById).toHaveBeenCalledWith(null);
        });
    })

    describe('addClothes()', () => {
        it('should create new clothes product',async () => {
            const entity = await service.addClothes(mockClothesDto);
            const dto = ClothesDto.fromEntity(entity)

            expect(dto).toEqual(mockClothesDto);
            expect(mockClothesRepo.addClothes).toHaveBeenCalledWith(mockClothesDto);
        })
    });



    describe('editClothes()', () => {
        it('should update clothes by id',async () => {
            const clothesDto: ClothesDto = {
                size: 'S',
                title: 'Super clothes',
                price: 20,
                description: 'Best product',
                image: 'url',
                quantity: 2,
                category: ProductCategories.Clothes,
                type: ProductTypes.Costume,
                ...mockedBasicFields,
            };
            const data: Partial<ClothesDto> = {
                size: 'L',
            }
            const res = await service.editClothes(clothesDto.id, data);

            expect(res.size).toEqual('L');
            expect(mockClothesRepo.editClothes).toHaveBeenCalledWith(clothesDto.id, data);
        })
    });

});
