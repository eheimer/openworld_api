import { ItemCategory } from "../models/ItemCategory"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'

export class ItemCategoryFactory extends EntityFactory<ItemCategory>{
    constructor(){super(ItemCategory)}
    makeDummy(faker?: Faker.FakerStatic): ItemCategory {
        if (!faker) faker = defaultFaker;
        const i = new ItemCategory()
        i.name = faker.hacker.noun()
        return i
    }

}