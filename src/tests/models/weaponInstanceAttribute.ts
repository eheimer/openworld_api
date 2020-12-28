import DB from "../../utils/db"
import faker from 'faker'
import { Repository } from "typeorm"
import { WeaponInstanceAttributeFactory } from "../../api/factories/WeaponInstanceAttributeFactory"
import { WeaponInstanceAttribute } from "../../api/models/WeaponInstanceAttribute"

let repo: Repository<WeaponInstanceAttribute>
let factory = new WeaponInstanceAttributeFactory()

beforeAll(async () => {
    await DB.init();
    repo = factory.getRepository()
})
describe('save', () => {
    it('should create weaponInstanceAttribute', async () => {
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
    it('should update weaponInstanceAttribute', async () => {
        const ai = await factory.makeDummyWithAll()
        let aidb = await factory.create(ai)
        
        aidb.value = faker.random.number(20)
        await repo.save(aidb);

        const acdb2 = await repo.findOne(aidb.id);

        expect(acdb2.value).toEqual(aidb.value);
    })
    it('should not save weaponInstanceAttribute without attribute', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.attribute
        await expect(factory.create(ai)).rejects.toThrowError(/weapon_instance_attribute.attributeId/)
    })
    it('should save weaponInstanceAttribute without slayer or weapon', async () => {
        const ai = await factory.makeDummyWithAll()
        delete ai.weapon
        delete ai.slayer
        const aidb = await factory.create(ai)
        expect(aidb.id).not.toBeNull()
    })
})

