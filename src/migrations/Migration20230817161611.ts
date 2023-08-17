import { Migration } from '@mikro-orm/migrations';

export class Migration20230817161611 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "test_entity" ("id" serial primary key, "name" varchar(255) not null);');

    this.addSql('create table "users" ("id" uuid not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "status" text check ("status" in (\'active\', \'archived\')) not null default \'active\', "user_name" varchar(255) not null, "password" varchar(255) not null, "email" varchar(255) not null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

}
