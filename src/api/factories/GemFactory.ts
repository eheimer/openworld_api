import { Gem } from '../models/Gem';
import { EntityFactory } from './EntityFactory';
import defaultFaker from 'faker';

export class GemFactory extends EntityFactory<Gem> {
  constructor() {
    super(Gem);
  }
  makeDummy(faker?: Faker.FakerStatic): Gem {
    if (!faker) faker = defaultFaker;
    const g = new Gem();
    g.name = faker.hacker.noun();
    g.weight = faker.datatype.number();
    g.image = faker.system.filePath();
    g.level = faker.datatype.number();
    return g;
  }
}
