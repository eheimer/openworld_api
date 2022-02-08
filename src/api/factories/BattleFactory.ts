import Battle from '../models/Battle'
import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'
import CharacterFactory from './CharacterFactory'
import CreatureInstanceFactory from './CreatureInstanceFactory'
import GameFactory from './GameFactory'

export default class BattleFactory extends EntityFactory<Battle> {
  constructor() {
    super(Battle)
  }
  makeDummy(faker?: Faker.FakerStatic): Battle {
    if (!faker) faker = defaultFaker
    const b = new Battle()
    b.round = faker.datatype.number(7)
    b.participants = []
    b.enemies = []
    b.friendlies = []
    return b
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<Battle> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.initiator = await new CharacterFactory().createDummy()
    dummy.participants[0] = dummy.initiator
    dummy.enemies[0] = await new CreatureInstanceFactory().createDummy()
    dummy.friendlies[0] = await new CreatureInstanceFactory().createDummy()
    dummy.game = await new GameFactory().createDummy()
    return dummy
  }
}
