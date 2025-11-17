import { MigrationInterface, QueryRunner } from 'typeorm'
import { SpellbookAttributeSeed } from '../../src/items/spellbooks/seed/SpellbookAttribute.seed.ts'

export class spellbookAttributes1662912666791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const SpellbookAttribute of SpellbookAttributeSeed) {
      await queryRunner.query(
        `INSERT INTO \`spellbook_attribute\` (\`id\`, \`name\`, \`value\`) VALUES (${SpellbookAttribute.id}, '${SpellbookAttribute.name}', '${SpellbookAttribute.value}')`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const SpellbookAttribute of SpellbookAttributeSeed) {
      await queryRunner.query(`DELETE FROM \`spellbook_attribute\` WHERE id = ${SpellbookAttribute.id}`)
    }
  }
}
