import DB from "../../utils/db"
import faker from 'faker'
import { Repository } from "typeorm"
import { ArmorInstanceAttributeFactory } from "../../api/factories/ArmorInstanceAttributeFactory"
import { ArmorInstanceAttribute } from "../../api/models/ArmorInstanceAttribute"

let repo: Repository<ArmorInstanceAttribute>
let factory = new ArmorInstanceAttributeFactory()

beforeAll(async () => {
    await DB.init();
    repo = factory.getRepository()
})
describe('armorInstanceAttribute', () => {
    it('should create armorInstanceAttribute', async () => {
        const before = Date.now()
        const ai = await factory.makeDummyWithAll()
        let aidb = await factory.create(ai)
        const after = Date.now()
        const fetched = await repo.findOne(aidb.id, { loadRelationIds: true })

        expect(fetched).not.toBeNull()

        expect(fetched.value).toBe(ai.value)
        expect(fetched.attribute).toBe(ai.attribute.id)

        expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })
    it('should update armorInstanceAttribute', async () => {
        const ai = await factory.makeDummyWithAll()
        let aidb = await factory.create(ai)

        aidb.value = faker.datatype.number(20)
        await repo.save(aidb);

        const acdb2 = await repo.findOne(aidb.id);

        expect(acdb2.value).toEqual(aidb.value);
    })
    it('should not save armorInstanceAttribute without attribute', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.attribute
        await expect(factory.create(ai)).rejects.toThrowError(/armor_instance_attribute.attributeId/)
    })
    it('should save armorInstanceAttribute without damageType or armor', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.damageType
        delete ai.armor
        const aidb = await factory.create(ai)
        expect(aidb.id).not.toBeNull()
    })
})

