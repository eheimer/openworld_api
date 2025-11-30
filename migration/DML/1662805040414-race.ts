import { MigrationInterface, QueryRunner } from 'typeorm'
import { RaceSeed } from '../../src/race/seed/Race.seed'
import { RaceSkillSeed } from '../../src/race/seed/RaceSkill.seed'

export class race1662805040414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const race of RaceSeed) {
      await queryRunner.query(
        `INSERT INTO \`race\` (\`id\`,\`name\`,\`description\`,\`movement\`,\`hpReplenish\`,\`staminaReplenish\`,\`manaReplenish\`) VALUES (${race.id}, '${race.name}','${race.description}','${race.movement}',${race.hpReplenish},${race.staminaReplenish},${race.manaReplenish});`
      )
    }
    for (const raceSkill of RaceSkillSeed) {
      await queryRunner.query(
        `INSERT INTO \`race_skill\` (\`id\`,\`raceId\`,\`skillId\`,\`level\`) VALUES (${raceSkill.id},${raceSkill.race},${raceSkill.skill},${raceSkill.level});`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const raceSkill of RaceSkillSeed) {
      await queryRunner.query(`DELETE FROM \`race_skill\` WHERE id = ${raceSkill.id};`)
    }
    for (const race of RaceSeed) {
      await queryRunner.query(`DELETE FROM \`race\` WHERE id = ${race.id};`)
    }
  }
}
