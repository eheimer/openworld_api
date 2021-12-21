import { SpellbookInstance } from '../models/SpellbookInstance';
import { EntityFactory } from './EntityFactory';
import defaultFaker from 'faker';
import { InventoryFactory } from './InventoryFactory';

export class SpellbookInstanceFactory extends EntityFactory<SpellbookInstance> {
  constructor() {
    super(SpellbookInstance);
  }
  makeDummy(faker?: Faker.FakerStatic): SpellbookInstance {
    if (!faker) faker = defaultFaker;
    const a = new SpellbookInstance();
    return a;
  }
  async makeDummyWithAll(
    faker?: Faker.FakerStatic
  ): Promise<SpellbookInstance> {
    if (!faker) faker = defaultFaker;
    const dummy = this.makeDummy();
    dummy.inventory = await new InventoryFactory().findOrCreateDummy();
    return dummy;
  }
}
