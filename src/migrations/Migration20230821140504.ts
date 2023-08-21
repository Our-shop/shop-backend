import { Migration } from '@mikro-orm/migrations';

export class Migration20230821140504 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "title" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "image" varchar(255) not null, "quantity" int not null, "category" text check ("category" in (\'food\', \'clothes\', \'toys\')) not null, "type" varchar(255) not null, "expiration_date" varchar(255) null, "size" varchar(255) null, "recommended_age" int null, constraint "product_entity_pkey" primary key ("id"));');

    this.addSql('create table "user_roles" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "Role type" varchar(255) not null, "permissions" text[] not null, constraint "user_roles_pkey" primary key ("id"));');

    this.addSql('create table "users" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "user_name" varchar(255) not null, "password" varchar(255) not null, "email" varchar(255) not null, "role_id" uuid null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql('create table "orders" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "total_amount" int not null, "delivery_id" varchar(255) not null, "user_id" uuid null, constraint "orders_pkey" primary key ("id"));');

    this.addSql('create table "order_items" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "title" varchar(255) not null, "product_quantity" int not null, "product_price" int not null, "order_id" uuid null, constraint "order_items_pkey" primary key ("id"));');

    this.addSql('alter table "users" add constraint "users_role_id_foreign" foreign key ("role_id") references "user_roles" ("id") on update cascade on delete set null;');

    this.addSql('alter table "orders" add constraint "orders_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;');

    this.addSql('alter table "order_items" add constraint "order_items_order_id_foreign" foreign key ("order_id") references "orders" ("id") on update cascade on delete set null;');
  }

}
