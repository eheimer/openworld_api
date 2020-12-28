import { CreatureInstance } from "../models/CreatureInstance"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { ConditionFactory } from "./ConditionFactory"
import { ActionFactory } from "./ActionFactory"
import { MonsterFactory } from "./MonsterFactory"

export class CreatureInstanceFactory extends EntityFactory<CreatureInstance>{
    constructor() { super(CreatureInstance) }
    makeDummy(faker?: Faker.FakerStatic): CreatureInstance {
        let action = new ActionFactory().makeDummy()
        if (!faker) faker = defaultFaker;
        const c = new CreatureInstance()
        c.name = faker.name.firstName()
        c.orighp = faker.random.number(100)
        c.hp = Math.min(c.orighp,faker.random.number(100))
        c.magery = faker.random.number(20)
        c.evalInt = faker.random.number(20)
        c.tactics = faker.random.number(20)
        c.resistSpell = faker.random.number(20)
        c.anatomy = faker.random.number(20)
        c.strength = faker.random.number(20)
        c.dexterity = faker.random.number(20)
        c.intelligence = faker.random.number(20)
        c.baseDmg = `${faker.random.number({min:1,max:3})}-${faker.random.number({min:4,max:10})}`
        c.initiative = faker.random.number(20)
        c.tamed = faker.random.boolean()
        c.actionName = action.name
        c.actionValue = action.value
        c.actionDescription = action.description
        c.actionDmgAmount = faker.random.number(20)
        c.hoverStats = faker.lorem.paragraph()
        c.specials = faker.lorem.paragraph()
        c.animate = faker.random.boolean()
        c.counter = faker.random.number(20)
        c.meleeDmg = faker.random.number(20)
        c.tameName = faker.name.firstName(20)
        c.stomach = faker.random.number(20)
        c.appetite = faker.random.number(20)
        c.obedience = faker.random.number(20)
        c.tracking = faker.random.number(20)
        c.resistPh = faker.random.number(20)
        c.resistC = faker.random.number(20)
        c.resistE = faker.random.number(20)
        c.resistF = faker.random.number(20)
        c.resistP = faker.random.number(20)
        return c
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<CreatureInstance> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        dummy.monster = await new MonsterFactory().findOrCreateDummy()
        return dummy;
    }
}