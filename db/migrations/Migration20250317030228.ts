import { Migration } from '@mikro-orm/migrations';

export class Migration20250317030228 extends Migration {

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

}
