import { Condition } from '../models/Condition'
import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'

export class ConditionFactory extends EntityFactory<Condition> {
  constructor() {
    super(Condition)
  }
  makeDummy(faker?: Faker.FakerStatic): Condition {
    if (!faker) faker = defaultFaker
    const c = new Condition()
    c.name = faker.fake('{{hacker.adjective}} {{hacker.noun}}')
    c.actionReplace = faker.hacker.adjective()
    c.duration = faker.datatype.number(10)
    c.damage = `${faker.datatype.number({
      min: 1,
      max: 3
    })}-${faker.datatype.number({ min: 4, max: 10 })}`
    c.delay = faker.datatype.number(3)
    c.cooldown = faker.datatype.number(3)
    c.removeOnHit = faker.datatype.boolean()
    c.removeOnHit = faker.datatype.boolean()
    c.allowMultiple = faker.datatype.boolean()
    return c
  }
}
