import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { MonsterLoot } from "../models/MonsterLoot"

export class MonsterLootFactory extends EntityFactory<MonsterLoot>{
    constructor(){super(MonsterLoot)}
    makeDummy(faker?: Faker.FakerStatic): MonsterLoot {
        if (!faker) faker = defaultFaker;
        const m = new MonsterLoot()
        m.qty = faker.random.number(10)
        m.level = faker.random.number(10)
        m.chance = faker.random.number(10)
        return m
    }
}