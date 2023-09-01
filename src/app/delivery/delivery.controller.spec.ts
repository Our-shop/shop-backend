import {I18nContext, I18nService} from 'nestjs-i18n';
import {DeliveryController} from './delivery.controller';
import {DeliveryService} from './delivery.service';
import {DeliveryEntity} from './entities/delivery.entity';
import {DeliveryDto} from './dtos/delivery.dto';
import {BasicStatuses} from '../../shared/enums/basic-statuses.enum';
import {NotFoundException} from '@nestjs/common';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {Test, TestingModule} from '@nestjs/testing';
import {UserDto} from '../users/dtos/user.dto';

describe('DeliveryController', () => {
    let controller: DeliveryController;
    let service: DeliveryService;
    const deliveryEntities: DeliveryEntity[] = [];
    let i18n: I18nContext;

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

    const mockDeliveryService = {
        addDelivery: jest.fn(dto => {
            return {
                ...dto
            }
        }),
        getAllDeliveries: jest.fn().mockResolvedValue(deliveryEntities),
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
            const found = mockDeliveryService.getDeliveryById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Delivery)
                );
            }
            return Object.assign(found,dto);
        }),
        deleteDelivery: jest.fn((id) => {
            const found = mockDeliveryService.getDeliveryById(id);
            if (!found) {
                throw new NotFoundException(
                    i18n.t(ErrorCodes.NotFound_Delivery)
                );
            }
            found.status = BasicStatuses.Archived;
            return found;
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DeliveryController],
            providers: [
                DeliveryService,
                {
                    provide: I18nService,
                    useValue: i18n,
                },
            ],
        })
            .overrideProvider(DeliveryService)
            .useValue(mockDeliveryService)
            .compile();

        controller = module.get<DeliveryController>(DeliveryController);
        service = module.get<DeliveryService>(DeliveryService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    describe('GET/deliveries', () => {
        it('should return array of deliveries', async () => {
            const result = await controller.getAllDeliveries();
            expect(result).toBeInstanceOf(Array);
            expect(mockDeliveryService.getAllDeliveries).toHaveBeenCalled();
        });
    });

    describe('GET/delivery/:id', () => {
        it('should return delivery by id', async () => {
            const res = await controller.addDelivery(mockDeliveryDto);
            let result = await controller.getDeliveryById(res.id, i18n);

            expect(result).toEqual(mockDeliveryDto);
            expect(mockDeliveryService.getDeliveryById).toHaveBeenCalledWith(mockDeliveryDto.id);
        });

        it('should return error if delivery not found', async () => {

            try {
                await controller.getDeliveryById(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockDeliveryService.getDeliveryById).toHaveBeenCalledWith(null);
        });
    });

    describe('GET/delivery/user/:userId', () => {
        it('should return array of deliveries for user by userId', async () => {
            let result = await controller.getDeliveriesByUserId(mockDeliveries[0].userId, i18n);

            expect(result).toBeInstanceOf(Array);
            expect(mockDeliveryService.getDeliveriesByUserId).toHaveBeenCalledWith(mockDeliveryDto.userId);
        });

        it('should return error if user deliveries not found', async () => {

            try {
                await controller.getDeliveriesByUserId(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockDeliveryService.getDeliveriesByUserId).toHaveBeenCalledWith(null);
        });
    });

    describe('POST/delivery', () => {
        it('should create delivery', async () => {
            const result = await controller.addDelivery(mockDeliveryDto);

            expect(result).toEqual(mockDeliveryDto);
            expect(mockDeliveryService.addDelivery).toHaveBeenCalledWith(mockDeliveryDto);
        });
    });

    describe('POST/:id', () => {
        it('should edit delivery', async () => {
            const data: Partial<DeliveryDto> = {
                city: 'Brest',
            }
            const res = await controller.updateDelivery(mockDeliveryDto.id, data);

            expect(res.city).toEqual('Brest');
            expect(mockDeliveryService.updateDelivery).toHaveBeenCalledWith(mockDeliveryDto.id, data);
        });
    });

    describe('DELETE/:id', () => {
        it('should archive delivery', async () => {
            const res = await controller.addDelivery(mockDeliveryDto);
            const deleted = await controller.deleteDelivery(res.id, i18n);


            expect(deleted.status).toEqual('archived');
            expect(mockDeliveryService.deleteDelivery).toHaveBeenCalledWith(res.id);
        });

        it('should return error if delivery not found', async () => {

            try {
                await controller.deleteDelivery(null, i18n);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(mockDeliveryService.deleteDelivery).toHaveBeenCalledWith(null);
        });
    });





})
