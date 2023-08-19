import { Migration } from '@mikro-orm/migrations';

export class Migration20230819120115 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_entity" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "title" varchar(255) not null, "price" int not null, "description" varchar(255) not null, "image" varchar(255) not null, "quantity" int not null, "category" text check ("category" in (\'food\', \'clothes\', \'toys\')) not null, "type" varchar(255) not null, "expiration_date" varchar(255) null, "size" varchar(255) null, "recommended_age" int null, constraint "product_entity_pkey" primary key ("id"));');

    this.addSql('create table "test_entity" ("id" serial primary key, "name" varchar(255) not null);');
  }

}
