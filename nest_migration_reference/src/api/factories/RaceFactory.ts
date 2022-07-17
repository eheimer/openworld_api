import defaultFaker from 'faker'
import Race from '../models/Race'

import EntityFactory from './EntityFactory'

export default class RaceFactory extends EntityFactory<Race> {
  constructor() {
    super(Race)
  }
  makeDummy(faker?: Faker.FakerStatic): Race {
    if (!faker) faker = defaultFaker
    const s = new Race()
    s.description = faker.lorem.paragraphs(3)
    s.name = faker.animal[faker.animal.type()]()
    s.movement = 'move ' + faker.datatype.number(3)
    s.hpReplenish = faker.datatype.number(20)
    s.manaReplenish = faker.datatype.number(20)
    s.staminaReplenish = faker.datatype.number(20)
    s.hunger = faker.datatype.number(20)
    s.sleep = faker.datatype.number(20)

    return s
  }
}
