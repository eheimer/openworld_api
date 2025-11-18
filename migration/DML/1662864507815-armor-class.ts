import { MigrationInterface, QueryRunner } from 'typeorm'
import { ArmorClassSeed } from '../../src/items/armor/seed/ArmorClass.seed.ts'

export class armorClass1662864507815 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorClassSeed) {
      await queryRunner.query(
        `INSERT INTO \`armor_class\` (\`id\`, \`name\`, \`durability\`) VALUES (${seed.id}, '${seed.name}', '${seed.durability}')`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorClassSeed) {
      await queryRunner.query(`DELETE FROM \`armor_class\` WHERE id = ${seed.id}`)
    }
  }
}
