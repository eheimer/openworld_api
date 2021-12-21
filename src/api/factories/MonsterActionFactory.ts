import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'
import { MonsterAction } from '../models/MonsterAction'

export class MonsterActionFactory extends EntityFactory<MonsterAction> {
  constructor() {
    super(MonsterAction)
  }
  makeDummy(faker?: Faker.FakerStatic): MonsterAction {
    if (!faker) faker = defaultFaker
    const m = new MonsterAction()
    m.value = faker.datatype.number(10)
    m.description = faker.hacker.verb()
    m.weight = faker.datatype.number(5)
    return m
  }
}
