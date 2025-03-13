import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class GroupsCrudPermissionsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.getConnection().execute(`
      INSERT INTO \`auth_permissions\` (\`slug\`, \`description\`) VALUES
      ("groups.list", "List all groups"),
      ("groups.show", "Show a group"),
      ("groups.create", "Create a group"),
      ("groups.update", "Update a group"),
      ("groups.delete", "Delete a group"),
      ("groups.restore", "Restore a group");
    `);
  }
}
