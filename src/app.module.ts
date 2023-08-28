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
import { ProductsModule } from './app/products/products.module';
import { AuthModule } from './app/auth/auth.module';
import { FoodModule } from './app/food/food.module';
import { ClothesModule } from './app/clothes/clothes.module';
import { ToysModule } from './app/toys/toys.module';
import { NotificationModule } from './app/notifications/notification.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [databaseConfig, appConfig],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: 'src/resources/i18n/',
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    // I18nModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => ({
    //     fallbackLanguage: 'en',
    //   }),
    //   inject: [ConfigService],
    //   global: true,
    //   fallbackLanguage: 'en',
    //   loaderOptions: {
    //     path: 'src/resources/i18n/',
    //     watch: true,
    //   },
    // }),
    // ===== app =====
    ProductsModule,
    FoodModule,
    ClothesModule,
    ToysModule,
    UsersModule,
    UserRolesModule,
    OrdersModule,
    OrderItemsModule,
    DeliveryModule,
    AuthModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
