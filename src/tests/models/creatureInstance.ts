import DB from "../../utils/db"
import faker from 'faker'
import { Repository } from "typeorm"
import { CreatureInstance } from "../../api/models/CreatureInstance"
import { CreatureInstanceFactory } from "../../api/factories/CreatureInstanceFactory"

let repo: Repository<CreatureInstance>
let factory = new CreatureInstanceFactory()

beforeAll(async () => {
    await DB.init();
    repo = factory.getRepository()
})
describe('creatureInstance', () => {
    it('should create creatureInstance', async () => {
        const before = Date.now()
        const c = await factory.makeDummyWithAll()
        let cdb = await factory.create(c)
        const after = Date.now()
        const fetched = await repo.findOne(cdb.id, { loadRelationIds: true })

        expect(fetched).not.toBeNull()

        expect(fetched.name).toBe(c.name)
        expect(fetched.hp).toBe(c.hp)

        expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })
    it('should update creatureInstance', async () => {
        const c = await factory.makeDummyWithAll()
        let cdb = await factory.create(c)

        cdb.name = faker.name.firstName()
        await repo.save(cdb);

        const bdb2 = await repo.findOne(cdb.id);

        expect(bdb2.name).toEqual(cdb.name);
    })
    it('should not save creatureInstance without monster', async () => {
        const b = await factory.makeDummyWithAll()
        delete b.monster
        await expect(factory.create(b)).rejects.toThrowError(/creature_instance.monsterId/)
    })
    it('should save character without conditions', async () => {
        const b = await factory.makeDummyWithAll()
        delete b.conditions
        await expect(factory.create(b)).resolves.toMatchObject({ name: b.name })
    })
})

