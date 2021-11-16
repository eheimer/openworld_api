import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { ArmorInstanceDamageReduction } from "../models/ArmorInstanceDamageReduction"
import { DamageTypeFactory } from "./DamageTypeFactory"

export class ArmorInstanceDamageReductionFactory extends EntityFactory<ArmorInstanceDamageReduction>{
    constructor() { super(ArmorInstanceDamageReduction) }
    makeDummy(faker?: Faker.FakerStatic): ArmorInstanceDamageReduction {
        if (!faker) faker = defaultFaker;
        const a = new ArmorInstanceDamageReduction()
        a.name = faker.hacker.noun()
        a.value = faker.datatype.number(20)
        return a
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<ArmorInstanceDamageReduction> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        dummy.damageType = await new DamageTypeFactory().createDummy()
        return dummy;
    }
}