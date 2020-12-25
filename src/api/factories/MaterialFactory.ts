import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { Material } from "../models/Material"

export class MaterialFactory extends EntityFactory<Material>{
    constructor(){super(Material)}
    makeDummy(faker?: Faker.FakerStatic): Material {
        if (!faker) faker = defaultFaker;
        const m = new Material()
        m.name = faker.hacker.noun()
        m.weaponDurability = faker.random.number()
        m.canSpawn = faker.random.boolean()
        m.base = faker.hacker.noun()
        return m
    }
}