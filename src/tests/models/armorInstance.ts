import DB from '../../utils/db'
import { Repository } from 'typeorm'
import { ArmorInstanceFactory } from '../../api/factories/ArmorInstanceFactory'
import { ArmorInstance } from '../../api/models/ArmorInstance'

let repo: Repository<ArmorInstance>
const factory = new ArmorInstanceFactory()

beforeAll(async () => {
  await DB.init()
  repo = factory.getRepository()
})
describe('armorInstance', () => {
  it('should create armorInstance', async () => {
    const before = Date.now()
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)
    const after = Date.now()
    const fetched = await repo.findOne(aidb.id, { loadRelationIds: true })

    expect(fetched).not.toBeNull()

    expect(fetched.equipped).toBe(ai.equipped)
    expect(fetched.damaged).toBe(ai.damaged)
    expect(fetched.armorClass).toBe(ai.armorClass.id)
    expect(fetched.location).toBe(ai.location.id)

    expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
  })
  it('should update armorInstance', async () => {
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)
    const equipped = aidb.equipped

    aidb.equipped = !equipped
    await repo.save(aidb)

    const acdb2 = await repo.findOne(aidb.id)

    expect(acdb2.equipped).toEqual(!equipped)
  })
  it('should not save armorInstance without armorClass', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.armorClass
    await expect(factory.create(ai)).rejects.toThrowError(/armor_instance.armorClassId/)
  })
  it('should not save armorInstance without location', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.location
    await expect(factory.create(ai)).rejects.toThrowError(/armor_instance.locationId/)
  })
  it('should not save armorInstance without inventory', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.inventory
    await expect(factory.create(ai)).rejects.toThrowError(/armor_instance.inventoryId/)
  })
})
