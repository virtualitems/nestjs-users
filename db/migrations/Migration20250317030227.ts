import { Migration } from '@mikro-orm/migrations';

export class Migration20250317030227 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`auth_roles\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`description\` text not null, \`created_at\` datetime null, \`deleted_at\` datetime null);`);
    this.addSql(`create unique index \`auth_roles_slug_unique\` on \`auth_roles\` (\`slug\`);`);
    this.addSql(`create index \`auth_roles_deleted_at_index\` on \`auth_roles\` (\`deleted_at\`);`);

    this.addSql(`create table \`auth_permissions\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`description\` text not null);`);
    this.addSql(`create unique index \`auth_permissions_slug_unique\` on \`auth_permissions\` (\`slug\`);`);

    this.addSql(`create table \`auth_roles_permissions\` (\`id\` integer not null primary key autoincrement, \`role_id\` integer not null, \`permission_id\` integer not null, constraint \`auth_roles_permissions_role_id_foreign\` foreign key(\`role_id\`) references \`auth_roles\`(\`id\`) on update cascade, constraint \`auth_roles_permissions_permission_id_foreign\` foreign key(\`permission_id\`) references \`auth_permissions\`(\`id\`) on update cascade);`);
    this.addSql(`create index \`auth_roles_permissions_role_id_index\` on \`auth_roles_permissions\` (\`role_id\`);`);
    this.addSql(`create index \`auth_roles_permissions_permission_id_index\` on \`auth_roles_permissions\` (\`permission_id\`);`);

    this.addSql(`create table \`persons_persons\` (\`id\` integer not null primary key autoincrement, \`name\` text not null, \`avatar\` text null, \`created_at\` text null, \`deleted_at\` text null);`);
    this.addSql(`create index \`persons_persons_deleted_at_index\` on \`persons_persons\` (\`deleted_at\`);`);

    this.addSql(`create table \`auth_users\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`email\` text not null, \`password\` text not null, \`last_login\` text null, \`created_at\` text null, \`deleted_at\` text null);`);
    this.addSql(`create unique index \`auth_users_slug_unique\` on \`auth_users\` (\`slug\`);`);
    this.addSql(`create index \`auth_users_email_index\` on \`auth_users\` (\`email\`);`);
    this.addSql(`create index \`auth_users_deleted_at_index\` on \`auth_users\` (\`deleted_at\`);`);

    this.addSql(`create table \`persons_persons_users\` (\`id\` integer not null primary key autoincrement, \`user_id\` integer not null, \`person_id\` integer not null, constraint \`persons_persons_users_user_id_foreign\` foreign key(\`user_id\`) references \`auth_users\`(\`id\`) on update cascade, constraint \`persons_persons_users_person_id_foreign\` foreign key(\`person_id\`) references \`persons_persons\`(\`id\`) on update cascade);`);
    this.addSql(`create index \`persons_persons_users_user_id_index\` on \`persons_persons_users\` (\`user_id\`);`);
    this.addSql(`create index \`persons_persons_users_person_id_index\` on \`persons_persons_users\` (\`person_id\`);`);

    this.addSql(`create table \`auth_users_roles\` (\`id\` integer not null primary key autoincrement, \`user_id\` integer not null, \`role_id\` integer not null, constraint \`auth_users_roles_user_id_foreign\` foreign key(\`user_id\`) references \`auth_users\`(\`id\`) on update cascade, constraint \`auth_users_roles_role_id_foreign\` foreign key(\`role_id\`) references \`auth_roles\`(\`id\`) on update cascade);`);
    this.addSql(`create index \`auth_users_roles_user_id_index\` on \`auth_users_roles\` (\`user_id\`);`);
    this.addSql(`create index \`auth_users_roles_role_id_index\` on \`auth_users_roles\` (\`role_id\`);`);

    this.addSql(`create table \`auth_users_permissions\` (\`id\` integer not null primary key autoincrement, \`user_id\` integer not null, \`permission_id\` integer not null, constraint \`auth_users_permissions_user_id_foreign\` foreign key(\`user_id\`) references \`auth_users\`(\`id\`) on update cascade, constraint \`auth_users_permissions_permission_id_foreign\` foreign key(\`permission_id\`) references \`auth_permissions\`(\`id\`) on update cascade);`);
    this.addSql(`create index \`auth_users_permissions_user_id_index\` on \`auth_users_permissions\` (\`user_id\`);`);
    this.addSql(`create index \`auth_users_permissions_permission_id_index\` on \`auth_users_permissions\` (\`permission_id\`);`);
  }

}
