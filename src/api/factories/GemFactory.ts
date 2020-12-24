import { Gem } from "../models/Gem"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'

export class GemFactory extends EntityFactory<Gem>{
    makeDummy(faker?: Faker.FakerStatic): Gem {
        if (!faker) faker = defaultFaker;
        const g = new Gem()
        g.name = faker.hacker.noun()
        g.weight = faker.random.number()
        g.image = faker.system.filePath()
        g.level = faker.random.number()
        return g
    }

}