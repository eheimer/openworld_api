import { Character } from "../models/Character"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { UserFactory } from "./UserFactory"
import { GameFactory } from "./GameFactory"
import { InventoryFactory } from "./InventoryFactory"

export class PublicCharacter {
    id: number; name: string; lastSeenAt: Date; hpPercent: number
    constructor(character: Character) {
        this.id = character.id
        this.name = character.name
        this.hpPercent = Math.round(character.maxHp/character.hp)
    }
}

export class CharacterFactory extends EntityFactory<Character>{
    constructor() { super(Character) }
    makeDummy(faker?: Faker.FakerStatic): Character {
        if (!faker) faker = defaultFaker;
        const c = new Character()
        c.name = faker.name.firstName()
        c.maxHp = faker.random.number(100)
        c.hp = Math.min(c.maxHp, faker.random.number(100))
        c.dmgIncrease = faker.random.number(10)
        c.baseDmgIncrease = faker.random.number(10)
        c.spellDmgIncrease = faker.random.number(10)
        c.baseResist = faker.random.number(10)
        c.resistPh = faker.random.number(10)
        c.resistC = faker.random.number(10)
        c.resistF = faker.random.number(10)
        c.resistE = faker.random.number(10)
        c.resistP = faker.random.number(10)
        c.dePh = faker.random.number(10)
        c.deC = faker.random.number(10)
        c.deF = faker.random.number(10)
        c.deE = faker.random.number(10)
        c.deP = faker.random.number(10)
        return c
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<Character> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        dummy.player = await new UserFactory().findOrCreateDummy()
        dummy.game = await new GameFactory().findOrCreateDummy()
        dummy.inventory = await new InventoryFactory().createDummy()
        
        return dummy;
    }
}