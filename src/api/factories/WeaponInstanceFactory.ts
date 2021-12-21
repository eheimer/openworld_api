import { WeaponInstance } from '../models/WeaponInstance'
import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'
import { InventoryFactory } from './InventoryFactory'
import { WeaponFactory } from './WeaponFactory'
import { MaterialFactory } from './MaterialFactory'

export class WeaponInstanceFactory extends EntityFactory<WeaponInstance> {
  constructor() {
    super(WeaponInstance)
  }
  makeDummy(faker?: Faker.FakerStatic): WeaponInstance {
    if (!faker) faker = defaultFaker
    const a = new WeaponInstance()
    a.equipped = faker.datatype.boolean()
    a.damaged = faker.datatype.boolean()
    return a
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<WeaponInstance> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.weapon = await new WeaponFactory().findOrCreateDummy()
    dummy.material = await new MaterialFactory().findOrCreateDummy()
    dummy.inventory = await new InventoryFactory().findOrCreateDummy()
    return dummy
  }
}
