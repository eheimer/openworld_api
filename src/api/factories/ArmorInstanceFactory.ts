import { ArmorInstance } from "../models/ArmorInstance"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { ArmorClassFactory } from "./ArmorClassFactory"
import { ArmorLocationFactory } from "./ArmorLocationFactory"
import { ArmorInstanceAttributeFactory } from "./ArmorInstanceAttributeFactory"
import { ArmorInstanceDamageReductionFactory } from "./ArmorInstanceDamageReductionFactory"
import { InventoryFactory } from "./InventoryFactory"

export class ArmorInstanceFactory extends EntityFactory<ArmorInstance>{
    constructor() { super(ArmorInstance) }
    makeDummy(faker?: Faker.FakerStatic): ArmorInstance {
        if (!faker) faker = defaultFaker;
        const a = new ArmorInstance()
        a.equipped = faker.random.boolean()
        a.damaged = faker.random.boolean()
        return a
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<ArmorInstance> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        dummy.armorClass = await new ArmorClassFactory().findOrCreateDummy()
        dummy.location = await new ArmorLocationFactory().findOrCreateDummy()
        dummy.inventory = await new InventoryFactory().findOrCreateDummy()
        return dummy;
    }
}