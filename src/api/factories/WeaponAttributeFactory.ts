import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { WeaponAttribute } from "../models/WeaponAttribute"

export class WeaponAttributeFactory extends EntityFactory<WeaponAttribute>{
    makeDummy(faker?: Faker.FakerStatic): WeaponAttribute {
        if (!faker) faker = defaultFaker;
        const w = new WeaponAttribute()
        w.name = faker.fake("{{hacker.adjective}} {{hacker.noun}}")
        w.value = `${faker.random.number({min:1,max:3})}-${faker.random.number({min:4,max:10})}`
        return w
    }

}