import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { Skill } from "../models/Skill"

export class SkillFactory extends EntityFactory<Skill>{
    makeDummy(faker?: Faker.FakerStatic): Skill {
        if (!faker) faker = defaultFaker;
        const s = new Skill()
        s.name = faker.hacker.ingverb()
        s.spellbook = faker.random.boolean()
        return s
    }
}