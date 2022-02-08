import DamageType from '../models/DamageType'
import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'

export default class DamageTypeFactory extends EntityFactory<DamageType> {
  constructor() {
    super(DamageType)
  }
  makeDummy(faker?: Faker.FakerStatic): DamageType {
    if (!faker) faker = defaultFaker
    const d = new DamageType()
    d.name = faker.hacker.noun()
    d.description = faker.hacker.phrase()
    d.chaos = faker.datatype.boolean()
    d.display = faker.datatype.boolean()
    d.soundurl = faker.system.filePath()
    d.imgurl = faker.system.filePath()
    return d
  }
}
