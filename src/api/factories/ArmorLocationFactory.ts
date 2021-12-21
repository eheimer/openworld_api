import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'
import { ArmorLocation } from '../models/ArmorLocation'

export class ArmorLocationFactory extends EntityFactory<ArmorLocation> {
  constructor() {
    super(ArmorLocation)
  }
  makeDummy(faker?: Faker.FakerStatic): ArmorLocation {
    if (!faker) faker = defaultFaker
    const a = new ArmorLocation()
    a.name = faker.hacker.noun()
    return a
  }
}
