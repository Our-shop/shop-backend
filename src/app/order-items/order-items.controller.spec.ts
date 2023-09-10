import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasicStatuses } from '../../shared/enums/basic-statuses.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemDto } from './dtos/order-item.dto';
import { OrderStatuses } from '../orders/enums/order-statuses.enum';

describe('OrdersItemsController', () => {
  let controller: OrderItemsController;
  let service: OrderItemsService;
  let jwtService: JwtService;
  let i18n: I18nContext;

  const orderItemEntities: OrderItemEntity[] = [
    {
      id: '60bbbfc9-309c-4186-91cd-4ead379120d3',
      created: new Date(1694274681000),
      updated: new Date(1694274695000),
      orderId: 'b125edca-d999-4f89-8e89-6874d68862b3',
      productId: '631ddbde-78c5-4005-a123-b91159148197',
      productQuantity: 1,
      productTitle: 'Rat Treat',
      productPrice: 6.82,
    },
    {
      id: 'fe6800d3-ef25-4eb4-8288-7d267995395d',
      created: new Date(1694274682000),
      updated: new Date(1694274695000),
      orderId: 'b125edca-d999-4f89-8e89-6874d68862b3',
      productId: '2b598ab1-0cd4-4802-8808-b38caf2920d6',
      productQuantity: 1,
      productTitle: 'qwersadadty Rat Treat',
      productPrice: 6.82,
    },
  ];
  const mockOrderItemDtos: OrderItemDto[] = [
    {
      id: '60bbbfc9-309c-4186-91cd-4ead379120d3',
      created: 1694274681000,
      updated: 1694274695000,
      orderId: 'b125edca-d999-4f89-8e89-6874d68862b3',
      productId: '631ddbde-78c5-4005-a123-b91159148197',
      productQuantity: 1,
      productTitle: 'Rat Treat',
      productPrice: 6.82,
    },
    {
      id: 'fe6800d3-ef25-4eb4-8288-7d267995395d',
      created: 1694274682000,
      updated: 1694274695000,
      orderId: 'b125edca-d999-4f89-8e89-6874d68862b3',
      productId: '2b598ab1-0cd4-4802-8808-b38caf2920d6',
      productQuantity: 1,
      productTitle: 'qwersadadty Rat Treat',
      productPrice: 6.82,
    },
  ];

  const mockOrdersItemsService = {
    getAllOrderItems: jest.fn().mockResolvedValue(orderItemEntities),
    getOrderById: jest.fn((id) => {
      return orderItemEntities.find((entity) => entity.id === id);
    }),
    getAllByOrderId: jest.fn((orderId) => {
      return orderItemEntities.filter((entity) => entity.orderId === orderId);
    }),
    addOrderItem: jest.fn((dto) => {
      return {
        ...dto,
        created: new Date(dto.created),
        updated: new Date(dto.updated),
      };
    }),
    editProductQuantity: jest.fn((id, dto) => {
      const found = orderItemEntities.find((entity) => entity.id === id);
      found.productQuantity = dto.productQuantity;

      return found;
    }),
    deleteOrderItem: jest.fn((id) => {
      const found = orderItemEntities.find((order) => order.id === id);

      return found;
    }),
    deleteAllByCartId: jest.fn((cartId) => {
      const found = orderItemEntities.filter(
        (order) => order.orderId === cartId,
      );

      return found;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [
        OrderItemsService,
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
      .overrideProvider(OrderItemsService)
      .useValue(mockOrdersItemsService)
      .compile();

    controller = module.get<OrderItemsController>(OrderItemsController);
    service = module.get<OrderItemsService>(OrderItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET/order-items', () => {
    it('should return array of order items', async () => {
      const result = await controller.getAllOrderItems();
      expect(result).toBeInstanceOf(Array<OrderItemDto>);
    });
  });

  describe('GET/order-items/:orderId', () => {
    it('should return one order', async () => {
      const result = await controller.getAllByOrderId(orderItemEntities[0].id);
      expect(result).toBeInstanceOf(Array<OrderItemDto>);
    });
  });

  describe('POST/orders-items', () => {
    it('should return all user orders', async () => {
      const result = await controller.addOrderItem(mockOrderItemDtos[0]);
      expect(result).toBeInstanceOf(OrderItemDto);
    });
  });

  describe('PUT/order-items/:orderItemId', () => {
    it('should make order by cartId', async () => {
      const result = await controller.editProductQuantity(
        orderItemEntities[0].id,
        mockOrderItemDtos[0],
      );
      expect(result).toBeInstanceOf(OrderItemDto);
    });
  });

  describe('DELETE/orders/:orderItemId', () => {
    it('should archive order by id', async () => {
      const result = await controller.deleteOrderItem(orderItemEntities[0].id);
      expect(result).toBeInstanceOf(OrderItemDto);
    });
  });

  describe('DELETE/orders/cart/:cartId', () => {
    it('should archive order by id', async () => {
      const result = await controller.deleteAllByCartId(
        orderItemEntities[0].orderId,
      );
      expect(result).toBeInstanceOf(Array<OrderItemDto>);
    });
  });
});
