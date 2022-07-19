import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'
import WeaponAttributeFactory from './WeaponAttributeFactory'
import WeaponInstanceAttribute from '../models/WeaponInstanceAttribute'

export default class WeaponInstanceAttributeFactory extends EntityFactory<WeaponInstanceAttribute> {
  constructor() {
    super(WeaponInstanceAttribute)
  }
  makeDummy(faker?: Faker.FakerStatic): WeaponInstanceAttribute {
    if (!faker) faker = defaultFaker
    const a = new WeaponInstanceAttribute()
    a.value = faker.datatype.number(20)
    return a
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<WeaponInstanceAttribute> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.attribute = await new WeaponAttributeFactory().findOrCreateDummy()
    return dummy
  }
}