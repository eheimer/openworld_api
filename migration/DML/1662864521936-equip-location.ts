import { MigrationInterface, QueryRunner } from 'typeorm'
import { EquipLocationSeed } from '../../src/items/seed/EquipLocation.seed'

export class equipLocation1662864521936 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const seed of EquipLocationSeed) {
      await queryRunner.query(`INSERT INTO "equip_location" ("id", "name") VALUES (${seed.id}, '${seed.name}')`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const seed of EquipLocationSeed) {
      await queryRunner.query(`DELETE FROM "equip_location" WHERE id = ${seed.id}`)
    }
  }
}
