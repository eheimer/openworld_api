import DB from '../../utils/db'
import faker from 'faker'
import { Repository } from 'typeorm'
import Game from '../../api/models/Game'
import GameFactory from '../../api/factories/GameFactory'

let repo: Repository<Game>
const factory = new GameFactory()

beforeAll(async () => {
  await DB.init()
  repo = factory.getRepository()
})
describe('game', () => {
  it('should create game', async () => {
    const before = Date.now()
    const c = await factory.makeDummyWithAll()
    const cdb = await factory.create(c)
    const after = Date.now()
    const fetched = await repo.findOne(cdb.id, { loadRelationIds: true })

    expect(fetched).not.toBeNull()

    expect(fetched.name).toBe(c.name)
    expect(fetched.maxPlayers).toBe(c.maxPlayers)

    expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
  })
  it('should update game', async () => {
    const c = await factory.makeDummyWithAll()
    const cdb = await factory.create(c)

    cdb.name = faker.name.firstName()
    await repo.save(cdb)

    const bdb2 = await repo.findOne(cdb.id)

    expect(bdb2.name).toEqual(cdb.name)
  })
  it('should not save game without owner', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.owner
    await expect(factory.create(b)).rejects.toThrowError(/game.ownerId/)
  })
  it('should not save game without players', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.players
    await expect(factory.create(b)).rejects.toThrowError(/Validation failed!/)
  })
  it('should save game without characters', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.characters
    await expect(factory.create(b)).resolves.toMatchObject({ name: b.name })
  })
})
