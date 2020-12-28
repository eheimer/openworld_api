import { Character } from "../models/Character"
import { EntityFactory } from "./EntityFactory"
import defaultFaker, { fake } from 'faker'
import { UserFactory } from "./UserFactory"
import { GameFactory } from "./GameFactory"
import { Inventory } from "../models/Inventory"

export class InventoryFactory extends EntityFactory<Inventory>{
    constructor() { super(Inventory) }
    makeDummy(faker?: Faker.FakerStatic): Inventory {
        if (!faker) faker = defaultFaker;
        const i = new Inventory()
        i.capacity = faker.random.number(20)
        i.limit = faker.random.boolean()
        i.gold = faker.random.number(500)
        return i
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<Inventory> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        return dummy;
    }
}