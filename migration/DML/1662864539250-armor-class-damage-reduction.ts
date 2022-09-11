import { MigrationInterface, QueryRunner } from 'typeorm'
import { ArmorClassDamageReductionSeed } from '../../src/items/armor/seed/ArmorClassDamageReduction.seed'

export class armorClassDamageReduction1662864539250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorClassDamageReductionSeed) {
      await queryRunner.query(
        `INSERT INTO "armor_class_damage_reduction" ("id", "level", "reduction", "armorClassId", "damageTypeId") VALUES (${seed.id}, ${seed.level}, '${seed.reduction}', ${seed.armorClass}, ${seed.damageType})`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorClassDamageReductionSeed) {
      await queryRunner.query(`DELETE FROM "armor_class_damage_reduction" WHERE id = ${seed.id}`)
    }
  }
}
