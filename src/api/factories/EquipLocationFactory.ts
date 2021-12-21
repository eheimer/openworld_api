import { EquipLocation } from '../models/EquipLocation'
import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'

export class EquipLocationFactory extends EntityFactory<EquipLocation> {
  constructor() {
    super(EquipLocation)
  }
  makeDummy(faker?: Faker.FakerStatic): EquipLocation {
    if (!faker) faker = defaultFaker
    const e = new EquipLocation()
    e.name = faker.hacker.noun()
    return e
  }
}
