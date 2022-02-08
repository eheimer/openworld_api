import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'
import SlayerType from '../models/SlayerType'

export default class SlayerTypeFactory extends EntityFactory<SlayerType> {
  constructor() {
    super(SlayerType)
  }
  makeDummy(faker?: Faker.FakerStatic): SlayerType {
    if (!faker) faker = defaultFaker
    const s = new SlayerType()
    s.name = faker.hacker.noun()
    return s
  }
}
