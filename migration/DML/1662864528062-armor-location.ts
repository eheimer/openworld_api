import { MigrationInterface, QueryRunner } from 'typeorm'
import { ArmorLocationSeed } from '../../src/items/armor/seed/ArmorLocation.seed'

export class armorLocation1662864528062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorLocationSeed) {
      await queryRunner.query(
        `INSERT INTO \`armor_location\` (\`id\`, \`name\`, \`locationId\`) VALUES (${seed.id}, '${seed.name}', ${seed.location})`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const seed of ArmorLocationSeed) {
      await queryRunner.query(`DELETE FROM \`armor_location\` WHERE id = ${seed.id}`)
    }
  }
}
