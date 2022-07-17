import defaultFaker from 'faker'

import Game from '../models/Game'
import EntityFactory from './EntityFactory'
import UserFactory from './UserFactory'

export default class GameFactory extends EntityFactory<Game> {
  constructor() {
    super(Game)
  }
  makeDummy(faker?: Faker.FakerStatic): Game {
    if (!faker) faker = defaultFaker
    const g = new Game()
    g.name = faker.fake('{{hacker.adjective}} {{hacker.noun}}')
    g.maxPlayers = faker.datatype.number(5)
    g.players = []
    return g
  }
  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<Game> {
    if (!faker) faker = defaultFaker
    const dummy = this.makeDummy()
    dummy.owner = await new UserFactory().findOrCreateDummy()
    dummy.players[0] = dummy.owner
    return dummy
  }
}
