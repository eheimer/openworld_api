import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { Material } from "../models/Material"

export class MaterialFactory extends EntityFactory<Material>{
    constructor(){super(Material)}
    makeDummy(faker?: Faker.FakerStatic): Material {
        if (!faker) faker = defaultFaker;
        const m = new Material()
        m.name = faker.hacker.noun()
        m.weaponDurability = faker.datatype.number()
        m.canSpawn = faker.datatype.boolean()
        m.base = faker.hacker.noun()
        return m
    }
}