import DB from "../../utils/db"
import faker from 'faker'
import { Repository } from "typeorm"
import { Inventory } from "../../api/models/Inventory"
import { InventoryFactory } from "../../api/factories/InventoryFactory"

let repo: Repository<Inventory>
let factory = new InventoryFactory()

beforeAll(async () => {
    await DB.init();
    repo = factory.getRepository()
})
describe('save', () => {
    it('should create inventory', async () => {
        const before = Date.now()
        const c = await factory.makeDummyWithAll()
        let cdb = await factory.create(c)
        const after = Date.now()
        const fetched = await repo.findOne(cdb.id,{loadRelationIds:true})

        expect(fetched).not.toBeNull()

        expect(fetched.capacity).toBe(c.capacity)
        expect(fetched.limit).toBe(c.limit)
        expect(fetched.gold).toBe(c.gold)

        expect(before-1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })
    it('should update inventory', async () => {
        const c = await factory.makeDummyWithAll()
        let cdb = await factory.create(c)
        
        cdb.gold = faker.random.number(500)
        await repo.save(cdb);

        const bdb2 = await repo.findOne(cdb.id);

        expect(bdb2.gold).toEqual(cdb.gold);
    })
    it('should save inventory without weapons', async () => {
        const b = await factory.makeDummyWithAll()
        delete b.weapons
        await expect(factory.create(b)).resolves.toMatchObject({gold: b.gold})
    })
})

