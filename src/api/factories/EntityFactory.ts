import DB, { getRepo } from "../../utils/db"
import { Repository, DeepPartial } from "typeorm"

export abstract class EntityFactory<T>{
    private _repo: Repository<T>
    protected faker: Faker.FakerStatic

    constructor(private entityClass: new () => T) { }

    getRepository(): Repository<T> {
        if (!this._repo) {
            this._repo = getRepo(this.entityClass.name, this.entityClass)
        }
        return this._repo;
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
        this.postCreate(a,t)
        await this.getRepository().save(a)
        return a
    }

    /**
     * Custom operations to perform after creating the object using the repository
     * 
     * @param created the item that the repo created
     * @param orig the original object from which the item was created
     */
    protected async postCreate(created: T, orig: DeepPartial<T>) { }

    /**
     * Generates a completely fabricated object using the default faker, or a custom one you pass
     * 
     * @param faker <optional> the faker to use
     * 
     * @returns the unpersisted entity
     */
    abstract makeDummy(faker?: Faker.FakerStatic): T

    /**
     * Generates and persists a fabricated object useing the default faker, or a custom one you pass
     * 
     * @param faker <optional> the faker to use
     * 
     * @returns the persisted entity
     */
    async createDummy(faker?: Faker.FakerStatic): Promise<T> {
        const t = this.makeDummy(faker)
        await this.getRepository().save(t);
        return t;
    }
}