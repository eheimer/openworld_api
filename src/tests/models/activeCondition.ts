// import { ActiveCondition } from "../../api/models/ActiveCondition"
// import DB, {getRepos} from "../../utils/db"
// import { Repository } from "typeorm"
// import faker from 'faker'
// import { EntityFactory } from "src/api/factories/EntityFactory"

// let repo: Repository<ActiveCondition>
// let factory: EntityFactory<ActiveCondition>

// beforeAll(async () => {
//     await DB.init();
//     repo = 
// })
// describe('save', () => {
//     it('should create activeCondition', async () => {
//         const rr = faker.random.number(20)
//         const cr = faker.random.number(20)
//         const before = Date.now()
//         const ac = repo.create({roundsRemaining: rr,cooldownRemaining:cr})
//         await repo.save(ac);
//         const after = Date.now()
//         const fetched = await repo.findOne(ac.id)

//         expect(fetched).not.toBeNull()

//         expect(fetched.roundsRemaining).toBe(rr)
//         expect(fetched.cooldownRemaining).toBe(cr)

//         expect(before-1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
//         expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
//     })
//     it('should update activeCondition', async () => {
//         const rr = faker.random.number(20)
//         const cr = faker.random.number(20)
//         const ac = repo.create({ roundsRemaining: rr, cooldownRemaining: cr })
//         const ac1 = await repo.save(ac)
        
//         ac1.roundsRemaining = 21
//         await repo.update(ac1.id, ac1);

//         const ac2 = await repo.findOne(ac1.id);

//         expect(ac2.roundsRemaining).toEqual(21);

//     })
//     it('should not save activeCondition without condition', async () => {

//     })
//     it('should not save if neither character nor creatureInstance are populated', async () => {
//         //we only validate that both are not empty here.  Our repo test
//         //will need to make sure that only one or the other is populated

//     })
//     it('should save without target', async () => {

//     })
// })

