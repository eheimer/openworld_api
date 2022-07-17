import DB from '../../utils/db'
import faker from 'faker'
import { Repository } from 'typeorm'
import ArmorInstanceDamageReductionFactory from '../../api/factories/ArmorInstanceDamageReductionFactory'
import ArmorInstanceDamageReduction from '../../api/models/ArmorInstanceDamageReduction'

let repo: Repository<ArmorInstanceDamageReduction>
const factory = new ArmorInstanceDamageReductionFactory()

beforeAll(async () => {
  await DB.init()
  repo = factory.getRepository()
})
describe('armorInstanceDamageReduction', () => {
  it('should create armorInstanceDamageReduction', async () => {
    const before = Date.now()
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)
    const after = Date.now()
    const fetched = await repo.findOne(aidb.id, { loadRelationIds: true })

    expect(fetched).not.toBeNull()

    expect(fetched.value).toBe(ai.value)
    expect(fetched.name).toBe(ai.name)
    expect(fetched.damageType).toBe(ai.damageType.id)

    expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
  })
  it('should update armorInstanceDamageReduction', async () => {
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)

    aidb.name = faker.hacker.verb()
    await repo.save(aidb)

    const acdb2 = await repo.findOne(aidb.id)

    expect(acdb2.name).toEqual(aidb.name)
  })
  it('should not save armorInstanceDamageReduction without damageType', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.damageType
    await expect(factory.create(ai)).rejects.toThrowError(/armor_instance_damage_reduction.damageTypeId/)
  })
})
