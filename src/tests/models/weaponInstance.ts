import DB from '../../utils/db'
import { Repository } from 'typeorm'
import WeaponInstanceFactory from '../../api/factories/WeaponInstanceFactory'
import WeaponInstance from '../../api/models/WeaponInstance'

let repo: Repository<WeaponInstance>
const factory = new WeaponInstanceFactory()

beforeAll(async () => {
  await DB.init()
  repo = factory.getRepository()
})
describe('weaponInstance', () => {
  it('should create weaponInstance', async () => {
    const before = Date.now()
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)
    const after = Date.now()
    const fetched = await repo.findOne(aidb.id, { loadRelationIds: true })

    expect(fetched).not.toBeNull()

    expect(fetched.equipped).toBe(ai.equipped)
    expect(fetched.damaged).toBe(ai.damaged)
    expect(fetched.weapon).toBe(ai.weapon.id)
    expect(fetched.material).toBe(ai.material.id)

    expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
  })
  it('should update weaponInstance', async () => {
    const ai = await factory.makeDummyWithAll()
    const aidb = await factory.create(ai)
    const equipped = aidb.equipped

    aidb.equipped = !equipped
    await repo.save(aidb)

    const acdb2 = await repo.findOne(aidb.id)

    expect(acdb2.equipped).toEqual(!equipped)
  })
  it('should not save weaponInstance without weapon', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.weapon
    await expect(factory.create(ai)).rejects.toThrowError(/weapon_instance.weaponId/)
  })
  it('should not save weaponInstance without material', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.material
    await expect(factory.create(ai)).rejects.toThrowError(/weapon_instance.materialId/)
  })
  it('should not save weaponInstance without inventory', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.inventory
    await expect(factory.create(ai)).rejects.toThrowError(/weapon_instance.inventoryId/)
  })
  it('should save weaponInstance without attribures', async () => {
    const ai = await factory.makeDummyWithAll()
    delete ai.attributes
    const aidb = await factory.create(ai)
    expect(aidb.id).not.toBeNull()
  })
})
