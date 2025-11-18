import { Injectable } from '@nestjs/common'
import { MonsterInstance } from "./entities/monster-instance.entity.js"
import { Monster } from "./entities/monster.entity.js"
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RandomService } from "../utils/random.service.js"
import { MonsterAction } from "./entities/monster-action.entity.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Injectable()
export class MonstersService {
  constructor(
    @InjectRepository(Monster) private readonly repo: Repository<Monster>,
    @InjectRepository(MonsterInstance) private readonly instRepo: Repository<MonsterInstance>,
    private readonly random: RandomService
  ) {}

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } })
  }

  async createInstance(monsterId: number): Promise<MonsterInstance> {
    const monster = await this.repo.findOne({
      where: { id: monsterId },
      relations: ['actions.action', 'damageType', 'breathDmgType']
    })
    const instance = this.initializeInstance(monster)

    return await this.instRepo.save(instance)
  }

  initializeInstance(monster: Monster): Partial<MonsterInstance> {
    const orighp = this.random.getRandomInRange(monster.hp)

    return {
      monster,
      name: monster.name,
      orighp,
      hp: orighp,
      resistF: this.random.getRandomInRange(monster.resistF),
      resistC: this.random.getRandomInRange(monster.resistC),
      resistP: this.random.getRandomInRange(monster.resistP),
      resistE: this.random.getRandomInRange(monster.resistE),
      resistPh: this.random.getRandomInRange(monster.resistPh),
      magery: this.random.getRandomInRange(monster.magery),
      evalInt: this.random.getRandomInRange(monster.evalInt),
      tactics: this.random.getRandomInRange(monster.tactics),
      resistSpell: this.random.getRandomInRange(monster.resistSpell),
      anatomy: this.random.getRandomInRange(monster.anatomy),
      strength: this.random.getRandomInRange(monster.strength),
      dexterity: this.random.getRandomInRange(monster.dexterity),
      intelligence: this.random.getRandomInRange(monster.intelligence),
      baseDmg: this.random.getRandomInRange(monster.baseDmg),
      tamed: false,
      hoverStats: monster.hoverStats,
      specials: monster.specials,
      appetite: this.random.getOneRandomItem([0.5, 1, 2]),
      stomach: this.random.getRandomInRange(4, 24),
      obedience: this.random.getRandomInRange(1, 6),
      tracking: this.random.getRandomInRange(monster.tracking),
      nextAction: this.getNextAction(monster.actions)
    }
  }

  getNextAction(actions: MonsterAction[]) {
    //extract array of weights from instance.monster.actions
    const weights = actions.map((ma) => ma.weight)
    //get random action from instance.monster.actions using weights
    return actions[this.random.weightedRandom(weights)]
  }

  findOneInstance(id: number) {
    return this.instRepo.findOne({ where: { id } })
  }

  removeInstance(id: number) {
    return this.instRepo.delete({ id })
  }
}

registerEntity('MonstersService', MonstersService)
