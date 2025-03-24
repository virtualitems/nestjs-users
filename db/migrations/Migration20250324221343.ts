import { Migration } from '@mikro-orm/migrations';

export class Migration20250324221343 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "auth_permissions" ("id" serial primary key, "slug" varchar(255) not null, "description" varchar(255) not null);`);
    this.addSql(`alter table "auth_permissions" add constraint "auth_permissions_slug_unique" unique ("slug");`);

    this.addSql(`create table "persons_persons" ("id" serial primary key, "name" varchar(255) not null, "avatar" varchar(255) null, "created_at" varchar(255) null, "deleted_at" varchar(255) null);`);
    this.addSql(`create index "persons_persons_deleted_at_index" on "persons_persons" ("deleted_at");`);

    this.addSql(`create table "auth_roles" ("id" serial primary key, "slug" varchar(255) not null, "description" varchar(255) not null, "created_at" timestamptz null, "deleted_at" timestamptz null);`);
    this.addSql(`alter table "auth_roles" add constraint "auth_roles_slug_unique" unique ("slug");`);
    this.addSql(`create index "auth_roles_deleted_at_index" on "auth_roles" ("deleted_at");`);

    this.addSql(`create table "auth_roles_permissions" ("id" serial primary key, "role_id" int not null, "permission_id" int not null);`);

    this.addSql(`create table "settings_settings" ("id" serial primary key, "slug" varchar(255) not null, "configurations" jsonb not null);`);
    this.addSql(`alter table "settings_settings" add constraint "settings_settings_slug_unique" unique ("slug");`);

    this.addSql(`create table "auth_users" ("id" serial primary key, "slug" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "is_confirmed" boolean not null default false, "last_login" varchar(255) null, "created_at" varchar(255) null, "deleted_at" varchar(255) null);`);
    this.addSql(`alter table "auth_users" add constraint "auth_users_slug_unique" unique ("slug");`);
    this.addSql(`create index "auth_users_email_index" on "auth_users" ("email");`);
    this.addSql(`create index "auth_users_deleted_at_index" on "auth_users" ("deleted_at");`);

    this.addSql(`create table "persons_persons_users" ("id" serial primary key, "user_id" int not null, "person_id" int not null);`);

    this.addSql(`create table "auth_users_permissions" ("id" serial primary key, "user_id" int not null, "permission_id" int not null);`);

    this.addSql(`create table "auth_users_roles" ("id" serial primary key, "user_id" int not null, "role_id" int not null);`);

    this.addSql(`alter table "auth_roles_permissions" add constraint "auth_roles_permissions_role_id_foreign" foreign key ("role_id") references "auth_roles" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "auth_roles_permissions" add constraint "auth_roles_permissions_permission_id_foreign" foreign key ("permission_id") references "auth_permissions" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "persons_persons_users" add constraint "persons_persons_users_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "persons_persons_users" add constraint "persons_persons_users_person_id_foreign" foreign key ("person_id") references "persons_persons" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "auth_users_permissions" add constraint "auth_users_permissions_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "auth_users_permissions" add constraint "auth_users_permissions_permission_id_foreign" foreign key ("permission_id") references "auth_permissions" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "auth_users_roles" add constraint "auth_users_roles_user_id_foreign" foreign key ("user_id") references "auth_users" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "auth_users_roles" add constraint "auth_users_roles_role_id_foreign" foreign key ("role_id") references "auth_roles" ("id") on update cascade on delete no action;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "auth_roles_permissions" drop constraint "auth_roles_permissions_permission_id_foreign";`);

    this.addSql(`alter table "auth_users_permissions" drop constraint "auth_users_permissions_permission_id_foreign";`);

    this.addSql(`alter table "persons_persons_users" drop constraint "persons_persons_users_person_id_foreign";`);

    this.addSql(`alter table "auth_roles_permissions" drop constraint "auth_roles_permissions_role_id_foreign";`);

    this.addSql(`alter table "auth_users_roles" drop constraint "auth_users_roles_role_id_foreign";`);

    this.addSql(`alter table "persons_persons_users" drop constraint "persons_persons_users_user_id_foreign";`);

    this.addSql(`alter table "auth_users_permissions" drop constraint "auth_users_permissions_user_id_foreign";`);

    this.addSql(`alter table "auth_users_roles" drop constraint "auth_users_roles_user_id_foreign";`);

    this.addSql(`drop table if exists "auth_permissions" cascade;`);

    this.addSql(`drop table if exists "persons_persons" cascade;`);

    this.addSql(`drop table if exists "auth_roles" cascade;`);

    this.addSql(`drop table if exists "auth_roles_permissions" cascade;`);

    this.addSql(`drop table if exists "settings_settings" cascade;`);

    this.addSql(`drop table if exists "auth_users" cascade;`);

    this.addSql(`drop table if exists "persons_persons_users" cascade;`);

    this.addSql(`drop table if exists "auth_users_permissions" cascade;`);

    this.addSql(`drop table if exists "auth_users_roles" cascade;`);
  }

}
