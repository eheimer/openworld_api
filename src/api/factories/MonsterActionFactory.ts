import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { MonsterAction } from "../models/MonsterAction"

export class MonsterActionFactory extends EntityFactory<MonsterAction>{
    makeDummy(faker?: Faker.FakerStatic): MonsterAction {
        if (!faker) faker = defaultFaker;
        const m = new MonsterAction()
        m.value = faker.random.number(10)
        m.description = faker.hacker.verb()
        m.weight = faker.random.number(5)
        return m
    }
}