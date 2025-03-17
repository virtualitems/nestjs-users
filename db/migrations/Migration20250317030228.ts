import { Migration } from '@mikro-orm/migrations';

export class Migration20250317030228 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.list', 'List users')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.show', 'Show user')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.create', 'Create user')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.update', 'Update user')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.delete', 'Delete user')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.restore', 'Restore user')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.login', 'Login user')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.getPermissions', 'Get user permissions')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.setPermissions', 'Set user permissions')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.getGroups', 'Get user groups')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('users.setGroups', 'Set user groups')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.list', 'List groups')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.show', 'Show group')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.create', 'Create group')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.update', 'Update group')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.delete', 'Delete group')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.restore', 'Restore group')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.getPermissions', 'Get group permissions')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('groups.setPermissions', 'Set group permissions')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('permissions.list', 'List permissions')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('persons.list', 'List persons')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('persons.show', 'Show person')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('persons.create', 'Create person')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('persons.update', 'Update person')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('persons.delete', 'Delete person')`);
    this.addSql(`insert into \`auth_permissions\` (\`slug\`, \`description\`) values ('persons.restore', 'Restore person')`);
  }

}
