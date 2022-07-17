import defaultFaker from 'faker'

import ArmorInstance from '../models/ArmorInstance'
import ArmorClassFactory from './ArmorClassFactory'
import ArmorLocationFactory from './ArmorLocationFactory'
import EntityFactory from './EntityFactory'
import InventoryFactory from './InventoryFactory'

export default class ArmorInstanceFactory extends EntityFactory<ArmorInstance> {
  constructor() {
    super(ArmorInstance)
  }
  makeDummy(faker?: Faker.FakerStatic): ArmorInstance {
    if (!faker) faker = defaultFaker
    const a = new ArmorInstance()
    a.equipped = faker.datatype.boolean()
    a.damaged = faker.datatype.boolean()
    return a
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<ArmorInstance> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.armorClass = await new ArmorClassFactory().findOrCreateDummy()
    dummy.location = await new ArmorLocationFactory().findOrCreateDummy()
    dummy.inventory = await new InventoryFactory().findOrCreateDummy()
    return dummy
  }
}
