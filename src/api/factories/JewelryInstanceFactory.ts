import { JewelryInstance } from '../models/JewelryInstance'
import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'
import { JewelryLocationFactory } from './JewelryLocationFactory'
import { InventoryFactory } from './InventoryFactory'
import { GemFactory } from './GemFactory'

export class JewelryInstanceFactory extends EntityFactory<JewelryInstance> {
  constructor() {
    super(JewelryInstance)
  }
  makeDummy(faker?: Faker.FakerStatic): JewelryInstance {
    if (!faker) faker = defaultFaker
    const a = new JewelryInstance()
    a.equipped = faker.datatype.boolean()
    a.damaged = faker.datatype.boolean()
    a.attributes = []
    return a
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<JewelryInstance> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.location = await new JewelryLocationFactory().findOrCreateDummy()
    dummy.gem = await new GemFactory().findOrCreateDummy()
    dummy.inventory = await new InventoryFactory().findOrCreateDummy()
    return dummy
  }
}
