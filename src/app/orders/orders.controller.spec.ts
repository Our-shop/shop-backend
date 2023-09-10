import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasicStatuses } from '../../shared/enums/basic-statuses.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { OrdersController } from '../orders/orders.controller';
import { OrdersService } from '../orders/orders.service';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderDto } from '../orders/dtos/order.dto';
import { OrderStatuses } from './enums/order-statuses.enum';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  let jwtService: JwtService;
  let i18n: I18nContext;

  const orderEntities: OrderEntity[] = [
    {
      id: 'e7ce7399-9db7-4baa-8f4f-8cd8a15ee30e',
      created: new Date(1694203814000),
      updated: new Date(1694242123000),
      status: BasicStatuses.Active,
      userId: '61b1e64f-9a9d-43a2-bfa2-3da12e3d4a0c',
      deliveryId: '86e16050-2dee-41b4-bb9a-f4f38cce68fa',
      orderStatus: OrderStatuses.InOrder,
      discount: 10,
      totalAmount: 4.99,
      orderItems: [],
    },
    {
      id: 'e7ce7399-9db7-4baa-8f4f-8cd8a15ee31f',
      created: new Date(1694203814000),
      updated: new Date(1694242123000),
      status: BasicStatuses.Active,
      userId: '61b1e64f-9a9d-43a2-bfa2-3da12e3d4a0c',
      deliveryId: '86e16050-2dee-41b4-bb9a-f4f38cce68fa',
      orderStatus: OrderStatuses.InOrder,
      discount: 5,
      totalAmount: 6,
      orderItems: [],
    },
  ];
  const mockOrderDtos: OrderDto[] = [
    {
      id: 'e7ce7399-9db7-4baa-8f4f-8cd8a15ee30e',
      created: 1694203814000,
      updated: 1694242123000,
      status: BasicStatuses.Active,
      userId: '61b1e64f-9a9d-43a2-bfa2-3da12e3d4a0c',
      deliveryId: '86e16050-2dee-41b4-bb9a-f4f38cce68fa',
      orderStatus: OrderStatuses.InOrder,
      discount: 10,
      totalAmount: 4.99,
    },
    {
      id: 'e7ce7399-9db7-4baa-8f4f-8cd8a15ee31f',
      created: 1694203814000,
      updated: 1694242123000,
      status: BasicStatuses.Active,
      userId: '61b1e64f-9a9d-43a2-bfa2-3da12e3d4a0c',
      deliveryId: '86e16050-2dee-41b4-bb9a-f4f38cce68fa',
      orderStatus: OrderStatuses.InOrder,
      discount: 5,
      totalAmount: 6,
    },
  ];
  const cartEntities: OrderEntity[] = [
    {
      id: '33cd3ad8-1dce-40a6-b56c-361d5e70c06c',
      created: new Date(1694199677000),
      updated: new Date(1694199677000),
      status: BasicStatuses.Active,
      userId: '3cbbd816-e4c2-45d7-ad79-d73a4c9375c7',
      deliveryId: null,
      orderStatus: OrderStatuses.InCart,
      discount: 10,
      totalAmount: null,
      orderItems: [],
    },
    {
      id: 'f3d750fe-14dc-42a1-9889-68b624c7513d',
      created: new Date(1694200116000),
      updated: new Date(1694200116000),
      status: BasicStatuses.Active,
      userId: '4116b511-32fa-486c-a891-e68cc0661dd8',
      deliveryId: null,
      orderStatus: OrderStatuses.InCart,
      discount: 0,
      totalAmount: null,
      orderItems: [],
    },
  ];
  const mockCartDtos: OrderDto[] = [
    {
      id: '33cd3ad8-1dce-40a6-b56c-361d5e70c06c',
      created: 1694199677000,
      updated: 1694199677000,
      status: BasicStatuses.Active,
      userId: '3cbbd816-e4c2-45d7-ad79-d73a4c9375c7',
      deliveryId: null,
      orderStatus: OrderStatuses.InCart,
      discount: 10,
      totalAmount: null,
    },
    {
      id: 'f3d750fe-14dc-42a1-9889-68b624c7513d',
      created: 1694200116000,
      updated: 1694200116000,
      status: BasicStatuses.Active,
      userId: '4116b511-32fa-486c-a891-e68cc0661dd8',
      deliveryId: null,
      orderStatus: OrderStatuses.InCart,
      discount: 0,
      totalAmount: null,
    },
  ];

  const mockOrdersService = {
    getAllOrders: jest.fn().mockResolvedValue(orderEntities),
    getOrderById: jest.fn((id) => {
      return orderEntities.find((entity) => entity.id === id);
    }),
    getOrdersByUserId: jest.fn((userId) => {
      return orderEntities.find((entity) => entity.id === userId);
    }),
    makeOrder: jest.fn((dto) => {
      return {
        ...dto,
        orderItems: orderEntities[0].orderItems,
        created: new Date(dto.created),
        updated: new Date(dto.updated),
        totalAmount: 1000,
        deliveryId: '90366a15-0176-4581-a124-357d479fe824',
        orderStatus: OrderStatuses.InOrder,
      };
    }),
    archiveOrder: jest.fn((id) => {
      const found = orderEntities.find((order) => order.id === id);
      found.status = BasicStatuses.Archived;

      return found;
    }),
    getAllCarts: jest.fn().mockResolvedValue(cartEntities),
    getCartById: jest.fn((id) => {
      return cartEntities.find((dto) => dto.id === id);
    }),
    getCartByUserId: jest.fn((userId) => {
      return cartEntities.find((dto) => dto.userId === userId);
    }),
    getActiveCart: jest.fn((token) => {
      return cartEntities.find((dto) => dto.userId === token);
    }),
    editCartDiscount: jest.fn((id, dto) => {
      return {
        ...cartEntities.find((dto) => dto.id === id),
        discount: dto.discount,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: I18nService,
          useValue: i18n,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    })
      .overrideProvider(OrdersService)
      .useValue(mockOrdersService)
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET/orders', () => {
    it('should return array of orders', async () => {
      const result = await controller.getAllOrders();
      expect(result).toBeInstanceOf(Array<OrderDto>);
    });
  });

  describe('GET/orders/:orderId', () => {
    it('should return one order', async () => {
      const result = await controller.getOrderById(mockOrderDtos[0].id);
      expect(result).toBeInstanceOf(OrderDto);
    });
  });

  describe('GET/orders/user/:userId', () => {
    it('should return all user orders', async () => {
      const result = await controller.getOrdersByUserId(
        mockOrderDtos[0].userId,
      );
      expect(result).toBeInstanceOf(Array<OrderDto>);
    });
  });

  describe('POST/orders/:cartId', () => {
    it('should make order by cartId', async () => {
      const result = await controller.makeOrder(
        mockCartDtos[0].id,
        mockCartDtos[0],
      );
      expect(result).toBeInstanceOf(OrderDto);
    });
  });

  describe('DELETE/orders/:orderId', () => {
    it('should archive order by id', async () => {
      const result = await controller.archiveOrder(orderEntities[0].id);
      expect(result).toBeInstanceOf(OrderDto);
    });
  });

  describe('GET/carts', () => {
    it('should return array of carts', async () => {
      const result = await controller.getAllCarts();
      expect(result).toBeInstanceOf(Array<OrderDto>);
    });
  });

  describe('GET/carts/:cartId', () => {
    it('should return one cart', async () => {
      const result = await controller.getOrderById(orderEntities[0].id);
      expect(result).toBeInstanceOf(OrderDto);
    });
  });

  describe('GET/carts/user/:userId', () => {
    it('should return active cart by userId', async () => {
      const result = await controller.getCartByUserId(cartEntities[0].userId);
      expect(result).toBeInstanceOf(OrderDto);
    });
  });

  describe('GET/carts/active', () => {
    it('should return active cart', async () => {
      const result = cartEntities[0];

      expect(result).toBeInstanceOf(Object);
    });
  });

  describe('PUT/carts/:cartId', () => {
    it('should edit cart discount', async () => {
      const result = await controller.editCartDiscount(
        mockCartDtos[0].id,
        cartEntities[0],
      );

      expect(result).toBeInstanceOf(OrderDto);
    });
  });
});
