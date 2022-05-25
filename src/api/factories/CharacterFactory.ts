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
    c.strength = faker.datatype.number(4)
    c.dexterity = faker.datatype.number(4)
    c.intelligence = faker.datatype.number(4)
    c.hp = faker.datatype.number(100)
    return c
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<Character> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.player = await new UserFactory().findOrCreateDummy()
    dummy.game = await new GameFactory().findOrCreateDummy()
    dummy.inventory = await new InventoryFactory().createDummy()
    dummy.skills = []
    return dummy
  }
}
