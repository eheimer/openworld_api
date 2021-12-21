import { ActiveCondition } from '../../api/models/ActiveCondition';
import DB from '../../utils/db';
import { Repository } from 'typeorm';
import { ActiveConditionFactory } from '../../api/factories/ActiveConditionFactory';
import { CharacterFactory } from '../../api/factories/CharacterFactory';

let repo: Repository<ActiveCondition>;
const factory = new ActiveConditionFactory();

beforeAll(async () => {
  await DB.init();
  repo = factory.getRepository();
});
describe('activeCondition', () => {
  it('should create activeCondition', async () => {
    const before = Date.now();
    const ac = await factory.makeDummyWithAll();
    const acdb = await factory.create(ac);
    const after = Date.now();
    const fetched = await repo.findOne(acdb.id);

    expect(fetched).not.toBeNull();

    expect(fetched.roundsRemaining).toBe(ac.roundsRemaining);
    expect(fetched.cooldownRemaining).toBe(ac.cooldownRemaining);

    expect(before - 1000).toBeLessThanOrEqual(fetched!.createdAt.getTime());
    expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after);
  });
  it('should update activeCondition', async () => {
    const ac = await factory.makeDummyWithAll();
    const acdb = await factory.create(ac);

    acdb.roundsRemaining = 21;
    await repo.save(acdb);

    const acdb2 = await repo.findOne(acdb.id);

    expect(acdb2.roundsRemaining).toEqual(21);
  });
  it('should not save activeCondition without condition', async () => {
    const ac = await factory.makeDummyWithAll();
    delete ac.condition;
    await expect(factory.create(ac)).rejects.toThrowError(
      /active_condition.conditionId/
    );
  });
  it('should save if either character or creatureInstance are not populated', async () => {
    const ac = await factory.makeDummyWithAll();
    delete ac.character;
    const acdb1 = await factory.create(ac);
    expect(acdb1.id).not.toBeNull();
    const ac2 = await factory.makeDummyWithAll();
    delete ac2.creature;
    const acdb2 = await factory.create(ac2);
    expect(acdb2.id).not.toBeNull();
  });
  it('should not save if neither character nor creatureInstance are populated', async () => {
    const ac = await factory.makeDummyWithAll();
    delete ac.character;
    delete ac.creature;
    await expect(factory.create(ac)).rejects.toThrowError(/Validation failed!/);
  });
  it('should not save if both character and creatureInstance are populated', async () => {
    //TODO: not sure if there is a validation I can use for this.  This might need to go in the service test
  });
  it('should create a reciprocal link on character', async () => {
    const ac = await factory.makeDummyWithAll();
    delete ac.creature;
    const characterRepo = new CharacterFactory().getRepository();
    const acdb = await factory.create(ac);
    const character = await characterRepo.findOne(acdb.character.id, {
      loadRelationIds: { relations: ['conditions'] }
    });
    expect(acdb.character.id).not.toBeNull();
    expect(character).not.toBeNull();
    expect(character.conditions[0]).toContain(acdb.id);
  });
  it('should save without target', async () => {
    const ac = await factory.makeDummyWithAll();
    delete ac.target;
    const acdb = await factory.create(ac);
    expect(acdb.id).not.toBeNull();
  });
});
