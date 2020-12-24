import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { JewelryAttribute } from "../models/JewelryAttribute"

export class JewelryAttributeFactory extends EntityFactory<JewelryAttribute>{
    makeDummy(faker?: Faker.FakerStatic): JewelryAttribute {
        if (!faker) faker = defaultFaker;
        const j = new JewelryAttribute()
        j.name = faker.fake("{{hacker.adjective}} {{hacker.noun}}")
        j.value = `${faker.random.number({min:1,max:3})}-${faker.random.number({min:4,max:10})}`
        return j
    }

}