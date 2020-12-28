import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { ArmorInstanceAttribute } from "../models/ArmorInstanceAttribute"
import { ArmorAttributeFactory } from "./ArmorAttributeFactory"
import { DamageTypeFactory } from "./DamageTypeFactory"

export class ArmorInstanceAttributeFactory extends EntityFactory<ArmorInstanceAttribute>{
    constructor() { super(ArmorInstanceAttribute) }
    makeDummy(faker?: Faker.FakerStatic): ArmorInstanceAttribute {
        if (!faker) faker = defaultFaker;
        const a = new ArmorInstanceAttribute()
        a.value = faker.random.number(20)
        return a
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<ArmorInstanceAttribute> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        dummy.attribute = await new ArmorAttributeFactory().findOrCreateDummy()
        return dummy;
    }
}