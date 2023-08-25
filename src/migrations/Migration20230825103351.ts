import { Migration } from '@mikro-orm/migrations';

export class Migration20230825103351 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "products" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "title" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "image" varchar(255) not null, "quantity" int not null, "category" text check ("category" in (\'food\', \'clothes\', \'toys\')) not null, "type" text check ("type" in (\'dry-food\', \'sticks\', \'ball\', \'sound-toy\', \'sweater\', \'costume\')) not null, "size" varchar(255) null, "expiration_date" varchar(255) null, "recommended_date" varchar(255) null, constraint "products_pkey" primary key ("id"));');
    this.addSql('create index "products_category_index" on "products" ("category");');

    this.addSql('create table "user_roles" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "Role type" varchar(255) not null, "permissions" text[] not null, constraint "user_roles_pkey" primary key ("id"));');

    this.addSql('create table "users" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "user_name" varchar(255) not null, "password" varchar(255) not null, "email" varchar(255) not null, "role_id" uuid null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql('create table "delivery" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "user_id" uuid null, "city" varchar(255) not null, "address" varchar(255) not null, "phone" varchar(255) not null, constraint "delivery_pkey" primary key ("id"));');

    this.addSql('create table "orders" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "user_id" uuid null, "delivery_id" uuid null, "order_status" text check ("order_status" in (\'in_cart\', \'in_order\')) not null default \'in_cart\', "discount" int not null, "total_amount" int null, constraint "orders_pkey" primary key ("id"));');

    this.addSql('create table "order_items" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "order_id" uuid null, "product_id" uuid null, "product_quantity" varchar(255) not null default 1, "product_title" varchar(255) null, "product_price" int null, constraint "order_items_pkey" primary key ("id"));');

    this.addSql('alter table "users" add constraint "users_role_id_foreign" foreign key ("role_id") references "user_roles" ("id") on update cascade on delete set null;');

    this.addSql('alter table "delivery" add constraint "delivery_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;');

    this.addSql('alter table "orders" add constraint "orders_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;');
    this.addSql('alter table "orders" add constraint "orders_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade on delete set null;');

    this.addSql('alter table "order_items" add constraint "order_items_order_id_foreign" foreign key ("order_id") references "orders" ("id") on update cascade on delete set null;');
    this.addSql('alter table "order_items" add constraint "order_items_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade on delete set null;');
  }

}
