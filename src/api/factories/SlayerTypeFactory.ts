import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { SlayerType } from "../models/SlayerType"

export class SlayerTypeFactory extends EntityFactory<SlayerType>{
    makeDummy(faker?: Faker.FakerStatic): SlayerType {
        if (!faker) faker = defaultFaker;
        const s = new SlayerType()
        s.name = faker.hacker.noun()
        return s
    }
}