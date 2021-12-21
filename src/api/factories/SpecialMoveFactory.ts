import { EntityFactory } from './EntityFactory';
import defaultFaker from 'faker';
import { SpecialMove } from '../models/SpecialMove';

export class SpecialMoveFactory extends EntityFactory<SpecialMove> {
  constructor() {
    super(SpecialMove);
  }
  makeDummy(faker?: Faker.FakerStatic): SpecialMove {
    if (!faker) faker = defaultFaker;
    const s = new SpecialMove();
    s.name = faker.fake('{{hacker.verb}} {{hacker.noun}}');
    s.stamina = faker.datatype.number(10);
    return s;
  }
}
