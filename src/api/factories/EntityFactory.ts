import { Repository,DeepPartial } from "typeorm"

export abstract class EntityFactory<T>{
    /**
     * Creates and persists an entity based on the DeepPartial you pass it
     * 
     * @param t the object to create
     * @param repo the Repository to use
     * 
     * @returns the persisted entity
     */
    async create(t: DeepPartial<T>, repo: Repository<T>): Promise<T> {
        const a = repo.create(t)
        this.postCreate(a,t,repo)
        await repo.save(a)
        return a
    }
    /**
     * Custom operations to perform after creating the object using the repository
     * 
     * @param created the item that the repo created
     * @param orig the original object from which the item was created
     * @param repo the repository used
     */
    protected async postCreate(created: T, orig: DeepPartial<T>, repo: Repository<T>) { }
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
     * @param repo the Repository to use
     * @param faker <optional> the faker to use
     * 
     * @returns the persisted entity
     */
    async createDummy(repo: Repository<T>,faker?: Faker.FakerStatic): Promise<T> {
        const t = this.makeDummy(faker)
        await repo.save(t);
        return t;
    }
}