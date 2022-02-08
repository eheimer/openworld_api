import CreatureInstanceFactory from '../factories/CreatureInstanceFactory'
import CreatureInstance from '../models/CreatureInstance'
import MonsterFactory from '../factories/MonsterFactory'
import RandomService from '../services/random'

const factory: CreatureInstanceFactory = new CreatureInstanceFactory()

/**
 * Generate a creature from a monster definition, save it to the database, and return it
 *
 * @param {*} monsterid
 */
async function generateCreature(monsterId: number | string): Promise<CreatureInstance> {
  const monster = await new MonsterFactory().getRepository().findOne({
    id: monsterId
  })
  const orighp = RandomService.getRandomInRange(monster.hp)
  const instance: CreatureInstance = await factory.create({
    monster,
    name: monster.name,
    orighp: orighp,
    hp: orighp,
    resistF: RandomService.getRandomInRange(monster.resistF),
    resistC: RandomService.getRandomInRange(monster.resistC),
    resistP: RandomService.getRandomInRange(monster.resistP),
    resistE: RandomService.getRandomInRange(monster.resistE),
    resistPh: RandomService.getRandomInRange(monster.resistPh),
    magery: RandomService.getRandomInRange(monster.magery),
    evalInt: RandomService.getRandomInRange(monster.evalInt),
    tactics: RandomService.getRandomInRange(monster.tactics),
    resistSpell: RandomService.getRandomInRange(monster.resistSpell),
    anatomy: RandomService.getRandomInRange(monster.anatomy),
    strength: RandomService.getRandomInRange(monster.strength),
    dexterity: RandomService.getRandomInRange(monster.dexterity),
    intelligence: RandomService.getRandomInRange(monster.intelligence),
    baseDmg: monster.baseDmg,
    hoverStats: monster.hoverStats,
    specials: monster.specials,
    appetite: RandomService.getOneRandomItem([0.5, 1, 2]),
    stomach: RandomService.getRandomInRange(4, 24),
    obedience: RandomService.getRandomInRange(1, 6),
    tracking: RandomService.getRandomInRange(monster.tracking)
  })
  return instance
}

export default { generateCreature }
