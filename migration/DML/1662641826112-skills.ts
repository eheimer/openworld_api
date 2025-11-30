import { MigrationInterface, QueryRunner } from 'typeorm'
import { SkillSeed } from '../../src/skills/seed/Skill.seed'

export class skills1662641826112 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const skill of SkillSeed) {
      await queryRunner.query(
        `INSERT INTO \`skill\` (\`id\`, \`name\`, \`spellbook\`) VALUES ('${skill.id}', '${skill.name}', ${skill.spellbook});`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const skill of SkillSeed) {
      await queryRunner.query(`DELETE FROM \`skill\` WHERE id = ${skill.id};`)
    }
  }
}
