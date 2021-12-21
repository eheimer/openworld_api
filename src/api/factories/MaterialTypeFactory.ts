import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'
import { MaterialType } from '../models/MaterialType'

export class MaterialTypeFactory extends EntityFactory<MaterialType> {
  constructor() {
    super(MaterialType)
  }
  makeDummy(faker?: Faker.FakerStatic): MaterialType {
    if (!faker) faker = defaultFaker
    const m = new MaterialType()
    m.name = faker.hacker.noun()
    return m
  }
}
