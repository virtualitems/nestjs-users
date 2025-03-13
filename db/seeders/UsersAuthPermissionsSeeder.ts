import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class UsersAuthPermissionsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.getConnection().execute(`
      INSERT INTO \`auth_permissions\` (\`slug\`, \`description\`) VALUES
      ('users.login', 'Login a user');
    `);
  }
}
