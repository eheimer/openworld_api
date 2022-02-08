import DB from '../../utils/db'
import { Repository } from 'typeorm'
import SpellbookInstanceFactory from '../../api/factories/SpellbookInstanceFactory'
import SpellbookInstance from '../../api/models/SpellbookInstance'
import InventoryFactory from '../../api/factories/InventoryFactory'

let repo: Repository<SpellbookInstance>
const factory = new SpellbookInstanceFactory()

beforeAll(async () => {
  await DB.init()
  repo = factory.getRepository()
})
describe('spellbookInstance', () => {
  it('should create spellbookInstance', async () => {
    const before = Date.now()
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)
    const after = Date.now()
    const fetched = await repo.findOne(aidb.id, { loadRelationIds: true })

    expect(fetched).not.toBeNull()

    expect(fetched.inventory).toBe(ai.inventory.id)

    expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
  })
  it('should update spellbookInstance', async () => {
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)
    const i = await new InventoryFactory().createDummy()

    aidb.inventory = i
    await repo.save(aidb)

    const acdb2 = await repo.findOne(aidb.id, { loadRelationIds: true })

    expect(acdb2.inventory).toEqual(i.id)
  })
  it('should not save spellbookInstance without inventory', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.inventory
    await expect(factory.create(ai)).rejects.toThrowError(/spellbook_instance.inventoryId/)
  })
  it('should save spellbookInstance without attributes', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.attributes
    const aidb = await factory.create(ai)
    expect(aidb.id).not.toBeNull()
  })
})
