import defaultFaker from 'faker'

import CreatureInstance from '../models/CreatureInstance'
import ActionFactory from './ActionFactory'
import EntityFactory from './EntityFactory'
import MonsterFactory from './MonsterFactory'

export default class CreatureInstanceFactory extends EntityFactory<CreatureInstance> {
  constructor() {
    super(CreatureInstance)
  }
  makeDummy(faker?: Faker.FakerStatic): CreatureInstance {
    const action = new ActionFactory().makeDummy()
    if (!faker) faker = defaultFaker
    const c = new CreatureInstance()
    c.name = faker.name.firstName()
    c.orighp = faker.datatype.number(100)
    c.hp = Math.min(c.orighp, faker.datatype.number(100))
    c.magery = faker.datatype.number(20)
    c.evalInt = faker.datatype.number(20)
    c.tactics = faker.datatype.number(20)
    c.resistSpell = faker.datatype.number(20)
    c.anatomy = faker.datatype.number(20)
    c.strength = faker.datatype.number(20)
    c.dexterity = faker.datatype.number(20)
    c.intelligence = faker.datatype.number(20)
    c.baseDmg = `${faker.datatype.number({
      min: 1,
      max: 3
    })}-${faker.datatype.number({ min: 4, max: 10 })}`
    c.initiative = faker.datatype.number(20)
    c.tamed = faker.datatype.boolean()
    c.actionName = action.name
    c.actionValue = action.value
    c.actionDescription = action.description
    c.actionDmgAmount = faker.datatype.number(20)
    c.hoverStats = faker.lorem.paragraph()
    c.specials = faker.lorem.paragraph()
    c.animate = faker.datatype.boolean()
    c.counter = faker.datatype.number(20)
    c.meleeDmg = faker.datatype.number(20)
    c.tameName = faker.name.firstName(20)
    c.stomach = faker.datatype.number(20)
    c.appetite = faker.datatype.number(20)
    c.obedience = faker.datatype.number(20)
    c.tracking = faker.datatype.number(20)
    c.resistPh = faker.datatype.number(20)
    c.resistC = faker.datatype.number(20)
    c.resistE = faker.datatype.number(20)
    c.resistF = faker.datatype.number(20)
    c.resistP = faker.datatype.number(20)
    return c
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<CreatureInstance> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.monster = await new MonsterFactory().findOrCreateDummy()
    return dummy
  }
}
