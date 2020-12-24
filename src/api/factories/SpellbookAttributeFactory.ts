import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { SpellbookAttribute } from "../models/SpellbookAttribute"

export class SpellbookAttributeFactory extends EntityFactory<SpellbookAttribute>{
    makeDummy(faker?: Faker.FakerStatic): SpellbookAttribute {
        if (!faker) faker = defaultFaker;
        const s = new SpellbookAttribute()
        s.name = faker.fake("{{hacker.adjective}} {{hacker.noun}}")
        s.value = `${faker.random.number({min:1,max:3})}-${faker.random.number({min:4,max:10})}`
        return s
    }

}