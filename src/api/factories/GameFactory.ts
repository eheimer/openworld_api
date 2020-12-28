import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { Game } from "../models/Game"
import { UserFactory } from "./UserFactory"
import { BattleFactory } from "./BattleFactory"
import { CharacterFactory } from "./CharacterFactory"

export class GameFactory extends EntityFactory<Game>{
    constructor() { super(Game) }
    makeDummy(faker?: Faker.FakerStatic): Game {
        if (!faker) faker = defaultFaker;
        const g = new Game()
        g.name = faker.fake('{{hacker.adjective}} {{hacker.noun}}')
        g.maxPlayers = faker.random.number(5)
        g.players = []
        return g 
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<Game> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        dummy.owner = await new UserFactory().findOrCreateDummy()
        dummy.players[0] = dummy.owner
        return dummy;
    }
}