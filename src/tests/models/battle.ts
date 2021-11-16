import DB from "../../utils/db"
import faker from 'faker'
import { Repository } from "typeorm"
import { Battle } from "../../api/models/Battle"
import { BattleFactory } from "../../api/factories/BattleFactory"
import { GameFactory } from "../../api/factories/GameFactory"

let repo: Repository<Battle>
let factory = new BattleFactory()

beforeAll(async () => {
    await DB.init();
    repo = factory.getRepository()
})
describe('save', () => {
    it('should create battle', async () => {
        const before = Date.now()
        const b = await factory.makeDummyWithAll()
        let bdb = await factory.create(b)
        const after = Date.now()
        const fetched = await repo.findOne(bdb.id,{loadRelationIds:true})

        expect(fetched).not.toBeNull()

        expect(fetched.round).toBe(b.round)
        expect(fetched.initiator).toBe(b.initiator.id)

        expect(before-1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })
    it('should update battle', async () => {
        const b = await factory.makeDummyWithAll()
        let bdb = await factory.create(b)
        
        bdb.round = faker.datatype.number(8)
        await repo.save(bdb);

        const bdb2 = await repo.findOne(bdb.id);

        expect(bdb2.round).toEqual(bdb.round);
    })
    it('should default round to 1 if null', async () => {
        const b = await factory.makeDummyWithAll()
        delete b.round
        const bdb = await factory.create(b)
        expect(bdb.round).toEqual(1)
    })
    it('should not save battle without initiator', async () => {
        const b = await factory.makeDummyWithAll()
        delete b.initiator
        await expect(factory.create(b)).rejects.toThrowError(/battle.initiatorId/)
    })
    it('should not save battle without game', async () => {
        const b = await factory.makeDummyWithAll()
        delete b.game
        await expect(factory.create(b)).rejects.toThrowError(/battle.gameId/)
    })
})

