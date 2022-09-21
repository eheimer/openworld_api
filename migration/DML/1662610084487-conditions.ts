import { MigrationInterface, QueryRunner } from 'typeorm'
import { ConditionSeed } from '../../src/conditions/seed/Condition.seed'

export class conditions1662610084487 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const condition of ConditionSeed) {
      await queryRunner.query(
        `INSERT INTO \`condition\` (\`id\`, \`name\`, \`actionReplace\`, \`duration\`, \`damage\`, \`delay\`, \`cooldown\`, \`removeOnHit\`, \`allowMultiple\`, \`damageTypeId\`) VALUES (${condition.id}, '${condition.name}', '${condition.actionReplace}', ${condition.duration}, '${condition.damage}', ${condition.delay}, ${condition.cooldown}, ${condition.removeOnHit}, ${condition.allowMultiple}, ${condition.damageType})`
      )
    }
    for (const condition of ConditionSeed) {
      if (condition.overrides) {
        for (const override of condition.overrides) {
          await queryRunner.query(
            `INSERT INTO \`condition_overrides_condition\` (\`conditionId_1\`, \`conditionId_2\`) VALUES (${condition.id}, ${override})`
          )
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const condition of ConditionSeed) {
      if (condition.overrides) {
        for (const override of condition.overrides) {
          await queryRunner.query(
            `DELETE FROM \`condition_overrides_condition\` WHERE \`conditionId_1\` = ${condition.id} AND \`conditionId_2\` = ${override}`
          )
        }
      }
      await queryRunner.query(`DELETE FROM \`condition\` WHERE \`id\` = ${condition.id}`)
    }
  }
}
