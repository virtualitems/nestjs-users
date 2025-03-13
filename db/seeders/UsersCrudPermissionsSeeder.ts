import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class UsersCrudPermissionsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.getConnection().execute(`
      INSERT INTO \`auth_permissions\` (\`slug\`, \`description\`) VALUES
      ('users.list', 'List all users'),
      ('users.show', 'Show a user'),
      ('users.create', 'Create a user'),
      ('users.update', 'Update a user'),
      ('users.delete', 'Delete a user'),
      ('users.restore', 'Restore a user');
    `);
  }
}
