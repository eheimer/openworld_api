import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { ArmorClass } from "../models/ArmorClass"

export class ArmorClassFactory extends EntityFactory<ArmorClass>{
    makeDummy(faker?: Faker.FakerStatic): ArmorClass {
        if (!faker) faker = defaultFaker;
        const a = new ArmorClass()
        a.name = faker.fake("{{hacker.adjective}} {{hacker.noun}}")
        a.durability = faker.random.number(10)
        return a
    }
}