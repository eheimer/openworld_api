import { MigrationInterface, QueryRunner } from 'typeorm'
import { ArmorAttributeSeed } from '../../src/items/armor/seed/ArmorAttribute.seed.ts'

export class armorAttribute1662864475172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorAttributeSeed) {
      await queryRunner.query(
        `INSERT INTO \`armor_attribute\` (\`id\`, \`name\`, \`value\`) VALUES (${seed.id}, '${seed.name}', '${seed.value}')`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorAttributeSeed) {
      await queryRunner.query(`DELETE FROM \`armor_attribute\` WHERE id = ${seed.id}`)
    }
  }
}
