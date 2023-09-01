import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@mikro-orm/nestjs';
import {EntityManager} from '@mikro-orm/postgresql';
import {DeliveryService} from './delivery.service';
import {DeliveryEntity} from './entities/delivery.entity';
import {DeliveryDto} from './dtos/delivery.dto';
import {I18nContext} from 'nestjs-i18n';

describe('DeliveryService', () => {
    let service: DeliveryService;
    const deliveryEntities: DeliveryEntity[] = [];
    let deliveryEntity: DeliveryEntity;
    let i18n: I18nContext;

    const mockEntityManager = {
        findAll: jest.fn().mockResolvedValue(deliveryEntities),
        findOne: jest.fn().mockResolvedValue(deliveryEntity),
        persistAndFlush: jest.fn(),
        flush: jest.fn(),
    };

    const mockDeliveryDto: DeliveryDto = {
        id: '1656daea-7253-4022-8560-b5ac2ed919bc',
        created: 1693305565000,
        updated: 1693305565000,
        status: BasicStatuses.Active,
        userId: '42e9c2ad-f6b3-4d20-a941-171bdce109bb',
        city: 'Minsk',
        address: 'Green street 17-9',
        phone: '8 017 2652814',
    }

    const mockDeliveries: DeliveryDto[] = [
        {
            id: '1656daea-7253-4022-8560-b5ac2ed919bc',
            created: 1693305565000,
            updated: 1693305565000,
            status: BasicStatuses.Active,
            userId: '42e9c2ad-f6b3-4d20-a941-171bdce109bb',
            city: 'Minsk',
            address: 'Green street 17-9',
            phone: '8 017 2652814',
        },
        {
            id: '1656daea-7253-4022-8560-b5ac2ed91123',
            created: 1693305565000,
            updated: 1693305565000,
            status: BasicStatuses.Active,
            userId: '42e9c2ad-f6b3-4d20-a941-171bdce109bb',
            city: 'Minsk',
            address: 'White street 55-2',
            phone: '8 017 2652814',
        }
    ]

    const mockDeliveryRepo = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        getAllDeliveries: jest.fn().mockResolvedValue(deliveryEntities),
        getList: jest.fn().mockResolvedValue(deliveryEntities),
        addDelivery: jest.fn(dto => {
            return {
                ...dto
            }
        }),
        getDeliveryById: jest.fn((id) => {
            if (!id) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Delivery)
                );
            }
            return {
                id: id,
                ...mockDeliveryDto,
            }
        }),
        getDeliveriesByUserId:jest.fn().mockResolvedValue(mockDeliveries),
        updateDelivery: jest.fn((id, dto) => {
            const found = mockDeliveryRepo.getDeliveryById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Delivery)
                );
            }
            return Object.assign(found,dto);
        }),
        deleteDelivery: jest.fn((id) => {
            const found = mockDeliveryRepo.getDeliveryById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Delivery)
                );
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
                DeliveryService,
                {
                    provide: getRepositoryToken(DeliveryEntity),
                    useValue: mockDeliveryRepo,
                },
                {
                    provide: EntityManager,
                    useValue: mockEntityManager,
                },
            ],
        })
            .overrideProvider(DeliveryService)
            .useValue(mockDeliveryRepo)
            .compile();

        service = module.get<DeliveryService>(DeliveryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllDeliveries()', () => {
        it('should return array',async () => {
            const result = await service.getAllDeliveries();
            expect(result).toBeInstanceOf(Array);
            expect(mockDeliveryRepo.getAllDeliveries).toHaveBeenCalled();
        })
    })

    describe('getDeliveryById()', () => {
        it('should return delivery by id',async () => {
            const res = await service.addDelivery(mockDeliveryDto);
            const entity = await service.getDeliveryById(res.id);
            const dto = DeliveryDto.fromEntity(entity);

            expect(dto).toEqual(mockDeliveryDto);
            expect(mockDeliveryRepo.getDeliveryById).toHaveBeenCalledWith(mockDeliveryDto.id);
        })

        it('should return NotFoundException if delivery not found', async () => {
            try {
                await service.getDeliveryById(null);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockDeliveryRepo.getDeliveryById).toHaveBeenCalledWith(null);
        });
    });

    describe('getDeliveriesByUserId()', () => {
        it('should return array of deliveries for user by userId', async () => {
            let result = await service.getDeliveriesByUserId(mockDeliveries[0].userId);

            expect(result).toBeInstanceOf(Array);
            expect(mockDeliveryRepo.getDeliveriesByUserId).toHaveBeenCalledWith(mockDeliveryDto.userId);
        });

        it('should return error if user deliveries not found', async () => {

            try {
                await service.getDeliveriesByUserId(null);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockDeliveryRepo.getDeliveriesByUserId).toHaveBeenCalledWith(null);
        });
    });

    describe('addDelivery()', () => {
        it('should create new delivery',async () => {
            const entity = await service.addDelivery(mockDeliveryDto);
            const dto = DeliveryDto.fromEntity(entity)

            expect(dto).toEqual(mockDeliveryDto);
            expect(mockDeliveryRepo.addDelivery).toHaveBeenCalledWith(mockDeliveryDto);
        })
    });

    describe('updateDelivery()', () => {
        it('should update delivery by id',async () => {
            const data: Partial<DeliveryDto> = {
                city: 'Grodno',
            }
            const res = await service.updateDelivery(mockDeliveryDto.id, data);
            const dto = DeliveryDto.fromEntity(res);

            expect(dto.city).toEqual('Grodno');
            expect(mockDeliveryRepo.updateDelivery).toHaveBeenCalledWith(mockDeliveryDto.id, data);
        })
    });

    describe('deleteDelivery()', () => {
        it('should archive delivery', async () => {
            const res = await service.addDelivery(mockDeliveryDto);
            const deleted = await service.deleteDelivery(res.id);

            expect(deleted.status).toEqual('archived');
            expect(mockDeliveryRepo.deleteDelivery).toHaveBeenCalledWith(res.id);
        });

        it('should return NotFoundException if delivery not found', async () => {
            try {
                await service.deleteDelivery(null);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockDeliveryRepo.deleteDelivery).toHaveBeenCalledWith(null);
        });
    });

})
