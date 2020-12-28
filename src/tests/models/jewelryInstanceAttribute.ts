import DB from "../../utils/db"
import faker from 'faker'
import { Repository } from "typeorm"
import { JewelryInstanceAttributeFactory } from "../../api/factories/JewelryInstanceAttributeFactory"
import { JewelryInstanceAttribute } from "../../api/models/JewelryInstanceAttribute"

let repo: Repository<JewelryInstanceAttribute>
let factory = new JewelryInstanceAttributeFactory()

beforeAll(async () => {
    await DB.init();
    repo = factory.getRepository()
})
describe('save', () => {
    it('should create jewelryInstanceAttribute', async () => {
        const before = Date.now()
        const ai = await factory.makeDummyWithAll()
        let aidb = await factory.create(ai)
        const after = Date.now()
        const fetched = await repo.findOne(aidb.id,{loadRelationIds:true})

        expect(fetched).not.toBeNull()

        expect(fetched.value).toBe(ai.value)
        expect(fetched.attribute).toBe(ai.attribute.id)

        expect(before-1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })
    it('should update jewelryInstanceAttribute', async () => {
        const ai = await factory.makeDummyWithAll()
        let aidb = await factory.create(ai)
        let value = aidb.value
        
        aidb.value = faker.random.number(20)
        await repo.save(aidb);

        const acdb2 = await repo.findOne(aidb.id);

        expect(acdb2.value).toEqual(aidb.value);
    })
    it('should not save jewelryInstanceAttribute without attribute', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.attribute
        await expect(factory.create(ai)).rejects.toThrowError(/jewelry_instance_attribute.attributeId/)
    })
    it('should save jewelryInstanceAttribute without skill or jewelry', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.skill
        delete ai.jewelry
        const aidb = await factory.create(ai)
        expect(aidb.id).not.toBeNull()
    })
})

