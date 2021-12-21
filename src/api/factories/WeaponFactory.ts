import { Weapon } from '../models/Weapon'
import { EntityFactory } from './EntityFactory'
import defaultFaker from 'faker'

export class WeaponFactory extends EntityFactory<Weapon> {
  constructor() {
    super(Weapon)
  }
  makeDummy(faker?: Faker.FakerStatic): Weapon {
    if (!faker) faker = defaultFaker
    const w = new Weapon()
    w.name = faker.hacker.noun()
    w.damage = `${defaultFaker.datatype.number({
      min: 1,
      max: 3
    })}-${defaultFaker.datatype.number({ min: 4, max: 10 })}`
    w.range = faker.datatype.number(5)
    w.speed = faker.datatype.number(5)
    w.strength = faker.datatype.number(10)
    w.hand = faker.datatype.number(2)
    return w
  }
}
