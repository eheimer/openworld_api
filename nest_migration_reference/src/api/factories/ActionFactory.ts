import Action from '../models/Action'
import EntityFactory from './EntityFactory'
import defaultFaker from 'faker'

export default class ActionFactory extends EntityFactory<Action> {
  constructor() {
    super(Action)
  }
  makeDummy(faker?: Faker.FakerStatic): Action {
    if (!faker) faker = defaultFaker
    const a = new Action()
    a.name = faker.hacker.verb()
    a.value = faker.datatype.number(10)
    a.description = faker.hacker.phrase()
    a.initiative = faker.datatype.number(10)
    a.spellDmgRange = `${faker.datatype.number({
      min: 1,
      max: 3
    })}-${faker.datatype.number({ min: 4, max: 10 })}`
    return a
  }
}