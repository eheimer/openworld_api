import { Weapon } from "../models/Weapon"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'

export class WeaponFactory extends EntityFactory<Weapon>{
    makeDummy(faker?: Faker.FakerStatic): Weapon {
        if (!faker) faker = defaultFaker;
        const w = new Weapon()
        w.name = faker.hacker.noun()
        w.damage = `${defaultFaker.random.number({min:1,max:3})}-${defaultFaker.random.number({min:4,max:10})}`
        w.range = faker.random.number(5)
        w.speed = faker.random.number(5)
        w.strength = faker.random.number(10)
        w.hand = faker.random.number(2)
        return w
    }

}