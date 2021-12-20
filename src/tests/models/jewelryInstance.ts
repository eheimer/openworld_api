import DB from "../../utils/db"
import { Repository } from "typeorm"
import { JewelryInstanceFactory } from "../../api/factories/JewelryInstanceFactory"
import { JewelryInstance } from "../../api/models/JewelryInstance"

let repo: Repository<JewelryInstance>
let factory = new JewelryInstanceFactory()

beforeAll(async () => {
    await DB.init();
    repo = factory.getRepository()
})
describe('jewelryInstance', () => {
    it('should create jewelryInstance', async () => {
        const before = Date.now()
        const ai = await factory.makeDummyWithAll()
        let aidb = await factory.create(ai)
        const after = Date.now()
        const fetched = await repo.findOne(aidb.id, { loadRelationIds: true })

        expect(fetched).not.toBeNull()

        expect(fetched.equipped).toBe(ai.equipped)
        expect(fetched.damaged).toBe(ai.damaged)
        expect(fetched.location).toBe(ai.location.id)
        expect(fetched.inventory).toBe(ai.inventory.id)
        expect(fetched.gem).toBe(ai.gem.id)

        expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })
    it('should update jewelryInstance', async () => {
        const ai = await factory.makeDummyWithAll()
        let aidb = await factory.create(ai)
        let equipped = aidb.equipped

        aidb.equipped = !equipped
        await repo.save(aidb);

        const acdb2 = await repo.findOne(aidb.id);

        expect(acdb2.equipped).toEqual(!equipped);
    })
    it('should not save jewelryInstance without gem', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.gem
        await expect(factory.create(ai)).rejects.toThrowError(/jewelry_instance.gemId/)
    })
    it('should not save jewelryInstance without location', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.location
        await expect(factory.create(ai)).rejects.toThrowError(/jewelry_instance.locationId/)
    })
    it('should not save jewelryInstance without inventory', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.inventory
        await expect(factory.create(ai)).rejects.toThrowError(/jewelry_instance.inventoryId/)
    })
    it('should save jewelryInstance without attributes', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.attributes
        let aidb = await factory.create(ai)
        expect(aidb.id).not.toBeNull()
    })
})

