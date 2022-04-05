import defaultFaker from 'faker'

import Skill from '../models/Skill'
import EntityFactory from './EntityFactory'

export default class SkillFactory extends EntityFactory<Skill> {
  constructor() {
    super(Skill)
  }
  makeDummy(faker?: Faker.FakerStatic): Skill {
    if (!faker) faker = defaultFaker
    const s = new Skill()
    s.name = faker.hacker.ingverb()
    s.description = faker.hacker.phrase()
    s.spellbook = faker.datatype.boolean()
    return s
  }
}
