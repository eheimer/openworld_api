import { DamageType } from "../models/DamageType"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'

export class DamageTypeFactory extends EntityFactory<DamageType>{
    makeDummy(faker?: Faker.FakerStatic): DamageType {
        if (!faker) faker = defaultFaker;
        const d = new DamageType()
        d.name= faker.hacker.noun()
        d.description = faker.hacker.phrase()
        d.chaos = faker.random.boolean()
        d.display = faker.random.boolean()
        d.soundurl = faker.system.filePath()
        d.imgurl = faker.system.filePath()
        return d
    }

}