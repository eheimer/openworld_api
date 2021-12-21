import { EntityFactory } from './EntityFactory';
import defaultFaker from 'faker';
import { JewelryInstanceAttribute } from '../models/JewelryInstanceAttribute';
import { JewelryAttributeFactory } from './JewelryAttributeFactory';

export class JewelryInstanceAttributeFactory extends EntityFactory<JewelryInstanceAttribute> {
  constructor() {
    super(JewelryInstanceAttribute);
  }
  makeDummy(faker?: Faker.FakerStatic): JewelryInstanceAttribute {
    if (!faker) faker = defaultFaker;
    const a = new JewelryInstanceAttribute();
    a.value = faker.datatype.number(20);
    return a;
  }
  async makeDummyWithAll(
    faker?: Faker.FakerStatic
  ): Promise<JewelryInstanceAttribute> {
    if (!faker) faker = defaultFaker;
    const dummy = this.makeDummy();
    dummy.attribute = await new JewelryAttributeFactory().findOrCreateDummy();
    return dummy;
  }
}
