import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'
import MonsterLoot from '../models/MonsterLoot'

export default class MonsterLootFactory extends EntityFactory<MonsterLoot> {
  constructor() {
    super(MonsterLoot)
  }
  makeDummy(faker?: Faker.FakerStatic): MonsterLoot {
    if (!faker) faker = defaultFaker
    const m = new MonsterLoot()
    m.qty = faker.datatype.number(10)
    m.level = faker.datatype.number(10)
    m.chance = faker.datatype.number(10)
    return m
  }
}
