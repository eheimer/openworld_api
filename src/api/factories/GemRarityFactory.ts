import { GemRarity } from "../models/GemRarity"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'

export class GemRarityFactory extends EntityFactory<GemRarity>{
    constructor(){super(GemRarity)}
    makeDummy(faker?: Faker.FakerStatic): GemRarity {
        if (!faker) faker = defaultFaker;
        const g = new GemRarity()
        g.name = faker.hacker.adjective()
        g.durability = faker.random.number()
        return g
    }

}