import Character from '../models/Character'
import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'
import UserFactory from './UserFactory'
import GameFactory from './GameFactory'
import InventoryFactory from './InventoryFactory'

export default class CharacterFactory extends EntityFactory<Character> {
  constructor() {
    super(Character)
  }
  makeDummy(faker?: Faker.FakerStatic): Character {
    if (!faker) faker = defaultFaker
    const c = new Character()
    c.name = faker.name.firstName()
    c.maxHp = faker.datatype.number(100)
    c.hp = Math.min(c.maxHp, faker.datatype.number(100))
    c.dmgIncrease = faker.datatype.number(10)
    c.baseDmgIncrease = faker.datatype.number(10)
    c.spellDmgIncrease = faker.datatype.number(10)
    c.baseResist = faker.datatype.number(10)
    c.resistPh = faker.datatype.number(10)
    c.resistC = faker.datatype.number(10)
    c.resistF = faker.datatype.number(10)
    c.resistE = faker.datatype.number(10)
    c.resistP = faker.datatype.number(10)
    c.dePh = faker.datatype.number(10)
    c.deC = faker.datatype.number(10)
    c.deF = faker.datatype.number(10)
    c.deE = faker.datatype.number(10)
    c.deP = faker.datatype.number(10)
    return c
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<Character> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.player = await new UserFactory().findOrCreateDummy()
    dummy.game = await new GameFactory().findOrCreateDummy()
    dummy.inventory = await new InventoryFactory().createDummy()

    return dummy
  }
}
