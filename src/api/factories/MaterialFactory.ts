import defaultFaker from 'faker'

import Material from '../models/Material'
import EntityFactory from './EntityFactory'

export default class MaterialFactory extends EntityFactory<Material> {
  constructor() {
    super(Material)
  }
  makeDummy(faker?: Faker.FakerStatic): Material {
    if (!faker) faker = defaultFaker
    const m = new Material()
    m.name = faker.hacker.noun()
    m.weaponDurability = faker.datatype.number()
    m.canSpawn = faker.datatype.boolean()
    return m
  }
}
