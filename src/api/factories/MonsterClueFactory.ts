import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { MonsterClue } from "../models/MonsterClue"

export class MonsterClueFactory extends EntityFactory<MonsterClue>{
    makeDummy(faker?: Faker.FakerStatic): MonsterClue {
        if (!faker) faker = defaultFaker;
        const m = new MonsterClue()
        m.trackingLevel = faker.random.number(5)
        m.clue = faker.hacker.phrase()
        return m
    }
}