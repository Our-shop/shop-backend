import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductsModule } from './app/products/products.module';
import { UsersModule } from './app/users/users.module';
import { UserRolesModule } from './app/user-roles/user-roles.module';
import { OrdersModule } from './app/orders/orders.module';
import { OrderItemsModule } from './app/order-items/order-items.module';
import { CartsModule } from './app/carts/carts.module';

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
    ProductsModule,
    UsersModule,
    UserRolesModule,
    OrdersModule,
    OrderItemsModule,
    CartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
