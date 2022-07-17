import DB from '../../utils/db'
import faker from 'faker'
import { Repository } from 'typeorm'
import Character from '../../api/models/Character'
import CharacterFactory from '../../api/factories/CharacterFactory'
import InventoryFactory from '../../api/factories/InventoryFactory'
import CharacterService from '../../api/services/character'
import CharacterSkillFactory from '../../api/factories/CharacterSkillFactory'

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
  it('should delete character, inventory, and skills', async () => {
    const c = await factory.makeDummyWithAll()
    c.skills.push(await new CharacterSkillFactory().findOrCreateDummy())
    const cdb = await factory.create(c)
    expect(cdb.skills).toHaveLength(1)
    await CharacterService.deleteCharacter(cdb.id)
    const inv = await new InventoryFactory().getRepository().findOne({ id: cdb.inventory.id })
    expect(inv).toBeUndefined()
    const skills = await new CharacterSkillFactory().getRepository().find({ character: { id: cdb.id } })
    expect(skills).toHaveLength(0)
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
  it('should save character without conditions, pets, and skills', async () => {
    const b = await factory.makeDummyWithAll()
    delete b.conditions
    delete b.pets
    delete b.skills
    await expect(factory.create(b)).resolves.toMatchObject({ name: b.name })
  })
})
