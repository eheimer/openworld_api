import { ClassDamageReduction } from "../models/ClassDamageReduction"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'

export class ClassDamageReductionFactory extends EntityFactory<ClassDamageReduction>{
    makeDummy(faker?: Faker.FakerStatic): ClassDamageReduction {
        if (!faker) faker = defaultFaker;
        const r = new ClassDamageReduction()
        r.level = faker.random.number(5)
        r.reduction = faker.hacker.noun()
        return r
    }

}