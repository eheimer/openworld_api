import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'
import { ArmorAttribute } from '../models/ArmorAttribute'

export class ArmorAttributeFactory extends EntityFactory<ArmorAttribute> {
  constructor() {
    super(ArmorAttribute)
  }
  makeDummy(faker?: Faker.FakerStatic): ArmorAttribute {
    if (!faker) faker = defaultFaker
    const a = new ArmorAttribute()
    a.name = faker.fake('{{hacker.adjective}} {{hacker.noun}}')
    a.value = `${faker.datatype.number({
      min: 1,
      max: 3
    })}-${faker.datatype.number({ min: 4, max: 10 })}`
    return a
  }
}
