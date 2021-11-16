import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { WeaponAttribute } from "../models/WeaponAttribute"

export class WeaponAttributeFactory extends EntityFactory<WeaponAttribute>{
    constructor(){super(WeaponAttribute)}
    makeDummy(faker?: Faker.FakerStatic): WeaponAttribute {
        if (!faker) faker = defaultFaker;
        const w = new WeaponAttribute()
        w.name = faker.fake("{{hacker.adjective}} {{hacker.noun}}")
        w.value = `${faker.datatype.number({min:1,max:3})}-${faker.datatype.number({min:4,max:10})}`
        w.hand = faker.datatype.number(2)
        return w
    }

}