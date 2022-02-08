import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'
import JewelryLocation from '../models/JewelryLocation'

export default class JewelryLocationFactory extends EntityFactory<JewelryLocation> {
  constructor() {
    super(JewelryLocation)
  }
  makeDummy(faker?: Faker.FakerStatic): JewelryLocation {
    if (!faker) faker = defaultFaker
    const j = new JewelryLocation()
    j.name = faker.hacker.noun()
    return j
  }
}
