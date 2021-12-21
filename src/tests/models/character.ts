import DB from '../../utils/db'
import faker from 'faker'
import { Repository } from 'typeorm'
import { Character } from '../../api/models/Character'
import { CharacterFactory } from '../../api/factories/CharacterFactory'

let repo: Repository<Character>
const factory = new CharacterFactory()

beforeAll(async () => {
  await DB.init()
  repo = factory.getRepository()
})
describe('character', () => {
  it('should create character', async () => {
    const before = Date.now()
    const c = await factory.makeDummyWithAll()
    const cdb = await factory.create(c)
    const after = Date.now()
    const fetched = await repo.findOne(cdb.id, { loadRelationIds: true })

    expect(fetched).not.toBeNull()

    expect(fetched.name).toBe(c.name)
    expect(fetched.hp).toBe(c.hp)

    expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
  })
  it('should update character', async () => {
    const c = await factory.makeDummyWithAll()
    const cdb = await factory.create(c)

    cdb.name = faker.name.firstName()
    await repo.save(cdb)

    const bdb2 = await repo.findOne(cdb.id)

    expect(bdb2.name).toEqual(cdb.name)
  })
  it('should not save character without game', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.game
    await expect(factory.create(b)).rejects.toThrowError(/character.gameId/)
  })
  it('should not save character without player', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.player
    await expect(factory.create(b)).rejects.toThrowError(/character.playerId/)
  })
  it('should not save character without inventory', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.inventory
    await expect(factory.create(b)).rejects.toThrowError(/character.inventoryId/)
  })
  it('should save character without conditions and pets', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.conditions
    delete b.pets
    await expect(factory.create(b)).resolves.toMatchObject({ name: b.name })
  })
})
