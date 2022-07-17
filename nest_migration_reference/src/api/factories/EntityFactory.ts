import { DeepPartial, Repository } from 'typeorm'

import { getRepo } from '../../utils/db'

export default abstract class EntityFactory<T> {
  private _repo: Repository<T>
  protected faker: Faker.FakerStatic

  constructor(private entityClass: new () => T) {}

  getRepository(): Repository<T> {
    if (!this._repo) {
      this._repo = getRepo(this.entityClass.name, this.entityClass)
    }
    return this._repo
  }

  /**
   * Creates and persists an entity based on the DeepPartial you pass it
   *
   * @param t the object to create
   * @param repo the Repository to use
   *
   * @returns the persisted entity
   */
  async create(t: DeepPartial<T>): Promise<T> {
    const a = await this.getRepository().create(t)
    await this.postCreate(a, t)
    await this.getRepository().save(a)
    return a
  }

  async createAll(t: DeepPartial<T>[]): Promise<T[]> {
    const created = []
    for (const item of t) {
      const a: T = await this.create(item)
      created.push(a)
    }
    return created
  }

  /**
   * Custom operations to perform after creating the object using the repository
   *
   * @param created the item that the repo created
   * @param orig the original object from which the item was created
   */
  protected async postCreate(created: T, orig: DeepPartial<T>) {
    return
  }

  /**
   * Generates a completely fabricated object using the default faker, or a custom one you pass
   *
   * @param faker <optional> the faker to use
   *
   * @returns the unpersisted entity
   */
  abstract makeDummy(faker?: Faker.FakerStatic): T

  async makeDummyWithAll(faker?: Faker.FakerStatic): Promise<T> {
    return this.makeDummy(faker)
  }

  /**
   * Generates and persists a fabricated object useing the default faker, or a custom one you pass
   *
   * @param faker <optional> the faker to use
   *
   * @returns the persisted entity
   */
  async createDummy(faker?: Faker.FakerStatic): Promise<T> {
    const t = await this.makeDummyWithAll(faker)
    // const a = await this.getRepository().save(t)
    const a = await this.create(t)
    return a
  }

  /**
   *
   */
  async findOrCreateDummy(faker?: Faker.FakerStatic): Promise<T> {
    let t = await this.getRepository().findOne()
    if (!t) {
      t = await this.createDummy(faker)
    }
    return t
  }
}
