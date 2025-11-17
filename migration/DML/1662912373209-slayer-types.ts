import { MigrationInterface, QueryRunner } from 'typeorm'
import { SlayerTypeSeed } from '../../src/damage-types/seed/SlayerType.seed.ts'

export class slayerTypes1662912373209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const slayerType of SlayerTypeSeed) {
      await queryRunner.query(
        `INSERT INTO \`slayer_type\` (\`id\`, \`name\`) VALUES (${slayerType.id}, '${slayerType.name}')`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const slayerType of SlayerTypeSeed) {
      await queryRunner.query(`DELETE FROM \`slayer_type\` WHERE id = ${slayerType.id}`)
    }
  }
}
