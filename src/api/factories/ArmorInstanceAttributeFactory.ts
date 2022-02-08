import defaultFaker from 'faker'

import ArmorInstanceAttribute from '../models/ArmorInstanceAttribute'
import ArmorAttributeFactory from './ArmorAttributeFactory'
import EntityFactory from './EntityFactory'

export default class ArmorInstanceAttributeFactory extends EntityFactory<ArmorInstanceAttribute> {
  constructor() {
    super(ArmorInstanceAttribute)
  }
  makeDummy(faker?: Faker.FakerStatic): ArmorInstanceAttribute {
    if (!faker) faker = defaultFaker
    const a = new ArmorInstanceAttribute()
    a.value = faker.datatype.number(20)
    return a
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<ArmorInstanceAttribute> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.attribute = await new ArmorAttributeFactory().findOrCreateDummy()
    return dummy
  }
}
