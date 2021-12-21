import { EntityFactory } from './EntityFactory';
import defaultFaker from 'faker';
import { SpellbookInstanceAttribute } from '../models/SpellbookInstanceAttribute';
import { SpellbookAttributeFactory } from './SpellbookAttributeFactory';

export class SpellbookInstanceAttributeFactory extends EntityFactory<SpellbookInstanceAttribute> {
  constructor() {
    super(SpellbookInstanceAttribute);
  }
  makeDummy(faker?: Faker.FakerStatic): SpellbookInstanceAttribute {
    if (!faker) faker = defaultFaker;
    const a = new SpellbookInstanceAttribute();
    a.value = faker.datatype.number(20);
    return a;
  }
  async makeDummyWithAll(
    faker?: Faker.FakerStatic
  ): Promise<SpellbookInstanceAttribute> {
    if (!faker) faker = defaultFaker;
    const dummy = this.makeDummy();
    dummy.attribute = await new SpellbookAttributeFactory().findOrCreateDummy();
    return dummy;
  }
}
