import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'
import CharacterSkill from '../models/CharacterSkill'
import SkillFactory from './SkillFactory'
import CharacterFactory from './CharacterFactory'

export default class CharacterSkillFactory extends EntityFactory<CharacterSkill> {
  constructor() {
    super(CharacterSkill)
  }
  makeDummy(faker?: Faker.FakerStatic): CharacterSkill {
    if (!faker) faker = defaultFaker
    const cs = new CharacterSkill()
    cs.level = faker.datatype.number(4)
    return cs
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<CharacterSkill> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.skill = await new SkillFactory().findOrCreateDummy()
    dummy.character = await new CharacterFactory().findOrCreateDummy()
    return dummy
  }
}
