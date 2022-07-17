import { getRepo } from '../utils/db'
import { MigrationInterface, QueryRunner, Repository } from 'typeorm'
import Race from '../api/models/Race'
import RaceSkill from '../api/models/RaceSkill'
import { RaceSeed } from '../seed/Race.seed'
import { RaceSkillSeed } from '../seed/RaceSkill.seed'
import Skill from '../api/models/Skill'

export class InitializeRaceData1653414574181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const raceRepo: Repository<Race> = getRepo('Race', Race)
    const raceSkillRepo: Repository<RaceSkill> = getRepo('RaceSkill', RaceSkill)
    const skillRepo: Repository<Skill> = getRepo('Skill', Skill)
    await raceRepo.save(RaceSeed)

    for (const item of RaceSkillSeed) {
      const race = await raceRepo.findOne(item.race)
      const skill = await skillRepo.findOne(item.skill)
      await raceSkillRepo.save({ id: item.id, race, skill, level: item.level })
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return
  }
}
