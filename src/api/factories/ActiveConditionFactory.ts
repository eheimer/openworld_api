import { ActiveCondition } from "../models/ActiveCondition"
import { EntityFactory } from "./EntityFactory"
import defaultFaker from 'faker'
import { ConditionFactory } from "./ConditionFactory"
import { CharacterFactory } from "./CharacterFactory"
import { CreatureInstanceFactory } from "./CreatureInstanceFactory"

export class ActiveConditionFactory extends EntityFactory<ActiveCondition>{
    constructor() { super(ActiveCondition) }
    makeDummy(faker?: Faker.FakerStatic): ActiveCondition {
        if (!faker) faker = defaultFaker;
        const a = new ActiveCondition()
        a.roundsRemaining = faker.datatype.number(5)
        a.cooldownRemaining = faker.datatype.number(5)
        return a
    }
    async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<ActiveCondition> {
        if (!faker) faker = defaultFaker;
        let dummy = this.makeDummy()
        dummy.condition = await new ConditionFactory().createDummy()
        dummy.character = await new CharacterFactory().createDummy()
        dummy.creature = await new CreatureInstanceFactory().createDummy()
        dummy.target = await new CreatureInstanceFactory().createDummy()
        return dummy;
    }
}