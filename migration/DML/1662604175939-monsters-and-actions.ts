import { MigrationInterface, QueryRunner } from 'typeorm'
import { MonsterSeed } from '../../src/monsters/seed/Monster.seed'
import { ActionSeed } from '../../src/monsters/seed/Action.seed'
import { MonsterActionSeed } from '../../src/monsters/seed/MonsterAction.seed'

export class monstersAndActions1662604175939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const monster of MonsterSeed) {
      await queryRunner.query(`
          INSERT INTO \`monster\` (\`id\`, \`name\`, \`hoverStats\`, \`karma\`, \`gold\`, \`alignment\`, \`hp\`, \`bard\`, \`taming\`, \`resistF\`, \`resistC\`, \`resistP\`, \`resistE\`, \`resistPh\`, \`magery\`, \`evalInt\`, \`aggroPriority\`, \`tactics\`, \`resistSpell\`, \`anatomy\`, \`strength\`, \`dexterity\`, \`intelligence\`, \`baseDmg\`, \`preferredFood\`, \`controlSlots\`, \`specials\`, \`animate\`, \`packInstinct\`, \`damageTypeId\`,\`breathDmgTypeId\`) VALUES (${monster.id}, '${monster.name}', '${monster.hoverStats}', '${monster.karma}', '${monster.gold}', '${monster.alignment}', '${monster.hp}', '${monster.bard}', '${monster.taming}', '${monster.resistF}', '${monster.resistC}', '${monster.resistP}', '${monster.resistE}', '${monster.resistPh}', '${monster.magery}', '${monster.evalInt}', '${monster.aggroPriority}', '${monster.tactics}', '${monster.resistSpell}', '${monster.anatomy}', '${monster.strength}', '${monster.dexterity}', '${monster.intelligence}', '${monster.baseDmg}', '${monster.preferredFood}', '${monster.controlSlots}', '${monster.specials}', ${monster.animate}, '${monster.packInstinct}', ${monster.damageType}, ${monster.breathDmgType});
        `)
    }
    for (const action of ActionSeed) {
      await queryRunner.query(`
          INSERT INTO \`action\` (\`id\`, \`name\`, \`value\`, \`description\`, \`initiative\`, \`spellDmgRange\`) VALUES (${action.id},'${action.name}', '${action.value}', '${action.description}', '${action.initiative}', '${action.spellDmgRange}');
        `)
    }
    for (const monsterAction of MonsterActionSeed) {
      await queryRunner.query(`
          INSERT INTO \`monster_action\` (\`id\`, \`value\`, \`description\`, \`weight\`, \`monsterId\`, \`actionId\`) VALUES (${monsterAction.id}, '${monsterAction.value}', '${monsterAction.description}', '${monsterAction.weight}', ${monsterAction.monster}, ${monsterAction.action});
        `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const monsterAction of MonsterActionSeed) {
      await queryRunner.query(`
          DELETE FROM \`monster_action\` WHERE \`id\` = ${monsterAction.id};
        `)
    }
    for (const action of ActionSeed) {
      await queryRunner.query(`
          DELETE FROM \`action\` WHERE \`id\` = ${action.name};
        `)
    }
    for (const monster of MonsterSeed) {
      await queryRunner.query(`
          DELETE FROM \`monster\` WHERE \`id\` = ${monster.id};
        `)
    }
  }
}
