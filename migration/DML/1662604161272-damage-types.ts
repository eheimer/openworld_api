import { MigrationInterface, QueryRunner } from 'typeorm'
import { DamageTypeSeed } from '../../src/damage-types/seed/DamageType.seed'

export class damageTypes1662604161272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const damageType of DamageTypeSeed) {
      await queryRunner.query(`
          INSERT INTO \`damage_type\` (\`id\`, \`name\`, \`description\`, \`chaos\`, \`display\`, \`soundurl\`, \`imgurl\`) VALUES (${damageType.id}, '${damageType.name}', '${damageType.description}', ${damageType.chaos}, ${damageType.display}, '${damageType.soundurl}', '${damageType.imgurl}');
        `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const damageType of DamageTypeSeed) {
      await queryRunner.query(`
          DELETE FROM \`damage_type\` WHERE id = ${damageType.id};
        `)
    }
  }
}
