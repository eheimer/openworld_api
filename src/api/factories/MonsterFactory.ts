import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { Monster } from "../models/Monster"

export class MonsterFactory extends EntityFactory<Monster>{
    makeDummy(faker?: Faker.FakerStatic): Monster {
        if (!faker) faker = defaultFaker;
        const m = new Monster()
        m.name = faker.hacker.noun()
        m.hoverStats = faker.lorem.paragraph()
        m.karma = this.rangeString()
        m.gold = this.rangeString()
        m.alignment = this.rangeString()
        m.hp = this.rangeString()
        m.bard = this.rangeString()
        m.taming = this.rangeString()
        m.resistF = this.rangeString()
        m.resistC = this.rangeString()
        m.resistP = this.rangeString()
        m.resistE = this.rangeString()
        m.resistPh = this.rangeString()
        m.magery = this.rangeString()
        m.evalInt = this.rangeString()
        m.aggroPriority = faker.random.number(5)
        m.tactics = this.rangeString()
        m.resistSpell = this.rangeString()
        m.anatomy = this.rangeString()
        m.strength = this.rangeString()
        m.dexterity = this.rangeString()
        m.intelligence = this.rangeString()
        m.baseDmg = this.rangeString()
        m.preferredFood = faker.hacker.noun()
        m.controlSlots = faker.random.number(5)
        m.specials = faker.lorem.paragraph()
        m.animate = faker.random.boolean()
        m.packInstinct = faker.hacker.noun()
        m.tracking = this.rangeString()
        return m
    }

    rangeString():string {
        return `${defaultFaker.random.number({min:1,max:3})}-${defaultFaker.random.number({min:4,max:10})}`
    }
}