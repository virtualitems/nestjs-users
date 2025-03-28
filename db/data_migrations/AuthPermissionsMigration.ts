import { Migration } from '@mikro-orm/migrations';

export class  extends Migration {

  override async up(): Promise<void> {
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.list', 'List users')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.show', 'Show user')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.create', 'Create user')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.update', 'Update user')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.delete', 'Delete user')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.restore', 'Restore user')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.login', 'Login user')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.getPermissions', 'Get user permissions')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.setPermissions', 'Set user permissions')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.getRoles', 'Get user roles')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('users.setRoles', 'Set user roles')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.list', 'List roles')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.show', 'Show role')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.create', 'Create role')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.update', 'Update role')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.delete', 'Delete role')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.restore', 'Restore role')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.getPermissions', 'Get role permissions')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('roles.setPermissions', 'Set role permissions')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('permissions.list', 'List permissions')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('persons.list', 'List persons')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('persons.show', 'Show person')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('persons.create', 'Create person')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('persons.update', 'Update person')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('persons.delete', 'Delete person')`);
    this.addSql(`insert into "auth_permissions" ("slug", "description") values ('persons.restore', 'Restore person')`);
  }

  override async down(): Promise<void> {
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.list';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.show';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.create';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.update';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.delete';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.restore';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.login';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.getPermissions';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.setPermissions';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.getRoles';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'users.setRoles';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.list';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.show';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.create';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.update';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.delete';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.restore';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.getPermissions';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'roles.setPermissions';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'permissions.list';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'persons.list';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'persons.show';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'persons.create';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'persons.update';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'persons.delete';`);
    this.addSql(`delete from "auth_permissions" where "slug" = 'persons.restore';`);
  }

}
