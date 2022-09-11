import { MigrationInterface, QueryRunner } from 'typeorm'
import { Monster } from '../../src/monsters/entities/monster.entity'
import { SlayerType } from '../../src/damage-types/entities/slayer-type.entity'

export class monsterSlayerTypes1662913463830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const slayerTypes: SlayerType[] = await queryRunner.query(`SELECT * FROM "slayer_type"`)
    const monsters: Monster[] = await queryRunner.query(`SELECT * FROM "monster"`)
    for (const monster of monsters) {
      let matchingSlayerTypes: SlayerType[] = []
      // add the monster-specific slayer if it exists
      const monsterSlayerType = slayerTypes.find(
        (st) => st.name.toLowerCase() === `${monster.name} Slayer`.toLowerCase()
      )
      if (monsterSlayerType) {
        matchingSlayerTypes.push(monsterSlayerType)
      }
      // now look for a super slayer type and add that as well
      const slayerTypeNames = monster.hoverStats.match(/Slayer: ([A-Za-z, ]+)/g)
      if (slayerTypeNames && slayerTypeNames.length > 0) {
        const extractedSlayerTypeNames = slayerTypeNames[0].replace('Slayer: ', '').split(',')
        for (const slayerTypeName of extractedSlayerTypeNames) {
          const slayerType = slayerTypes.find(
            (st) =>
              st.name.toLowerCase() === `${slayerTypeName.trim()} (Super Slayer)`.toLowerCase() ||
              st.name.toLowerCase() === `${slayerTypeName.trim()} Slayer`.toLowerCase()
          )
          if (slayerType) {
            matchingSlayerTypes.push(slayerType)
          }
        }
      }
      //now add the slayer types to the monster_slayers_slayer_type table
      //only add distinct slayer types
      matchingSlayerTypes = matchingSlayerTypes.filter(
        (slayerType, index, self) => index === self.findIndex((t) => t.name === slayerType.name)
      )
      for (const slayerType of matchingSlayerTypes) {
        await queryRunner.query(
          `INSERT INTO "monster_slayers_slayer_type"("monsterId", "slayerTypeId") VALUES (${monster.id}, ${slayerType.id})`
        )
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //not worth trying to figure out how to undo this, so we'll just truncate the table
    await queryRunner.query(`DELETE FROM "monster_slayers_slayer_type"`)
  }
}
