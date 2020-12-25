import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { WeaponSkill } from "../models/WeaponSkill"

export class WeaponSkillFactory extends EntityFactory<WeaponSkill>{
    constructor(){super(WeaponSkill)}
    makeDummy(faker?: Faker.FakerStatic): WeaponSkill {
        if (!faker) faker = defaultFaker;
        const w = new WeaponSkill()
        w.name = faker.hacker.ingverb()
        return w
    }
}