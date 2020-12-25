import DB from "../../utils/db"
import { Repository,DeepPartial, getRepository } from "typeorm"

export abstract class EntityFactory<T>{
    private repo: Repository<T>
    constructor(private entityClass: new() => T) {
        let className = (new this.entityClass()).constructor.name
        this.repo = DB.getInstance().repos[className]
        if (!this.repo) {
            this.repo = getRepository(this.entityClass, DB.getInstance().conn)
        }
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
        const a = await this.repo.create(t)
        this.postCreate(a,t)
        await this.repo.save(a)
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
        await this.repo.save(t);
        return t;
    }
}