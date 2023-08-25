import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './app/users/users.module';
import { UserRolesModule } from './app/user-roles/user-roles.module';
import { OrdersModule } from './app/orders/orders.module';
import { OrderItemsModule } from './app/order-items/order-items.module';
import { DeliveryModule } from './app/delivery/delivery.module';
import { CartsModule } from './app/carts/carts.module';
import { CartItemsModule } from './app/cart-items/cart-items.module';
import { AuthModule } from './app/auth/auth.module';
import { FoodModule } from './app/food/food.module';
import { ClothesModule } from './app/clothes/clothes.module';
import { ToysModule } from './app/toys/toys.module';
import { NotificationModule } from './app/notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [databaseConfig, appConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    // ===== app =====
    FoodModule,
    ClothesModule,
    ToysModule,
    UsersModule,
    UserRolesModule,
    OrdersModule,
    OrderItemsModule,
    DeliveryModule,
    CartsModule,
    CartItemsModule,
    AuthModule,
    NotificationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
