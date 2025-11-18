import { Injectable } from '@nestjs/common'
import { WeaponInstance } from "./entities/weapon-instance.entity.js"
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { Weapon } from "./entities/weapon.entity.js"
import { RandomService } from "../../utils/random.service.js"
import { Material } from "./entities/material.entity.js"
import { WeaponAttribute } from "./entities/weapon-attribute.entity.js"
import { WeaponInstanceAttribute } from "./entities/weapon-instance-attribute.entity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Injectable()
export class WeaponsService {
  //inject the Weapon repository into the constructor
  constructor(
    @InjectRepository(Weapon)
    private repo: Repository<Weapon>,
    @InjectRepository(WeaponInstance)
    private instanceRepo: Repository<WeaponInstance>,
    @InjectRepository(Material)
    private materialRepo: Repository<Material>,
    private randomService: RandomService,
    @InjectRepository(WeaponAttribute)
    private attRepo: Repository<WeaponAttribute>,
    @InjectRepository(WeaponInstanceAttribute)
    private attInstanceRepo: Repository<WeaponInstanceAttribute>
  ) {}

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} weapon`
  }

  remove(id: number) {
    return `This action removes a #${id} weapon`
  }

  async removeInstance(id: number) {
    const inst = await this.instanceRepo.findOne({ where: { id }, relations: ['attributes'] })
    inst.attributes.forEach((att) => {
      this.attInstanceRepo.remove(att)
    })
    return this.instanceRepo.remove(inst)
  }

  async randomItem(level: number) {
    const inst = new WeaponInstance()
    inst.equipped = false
    inst.damaged = false

    const weapons = await this.repo.find({ relations: ['material', 'skill', 'primaryMove', 'secondaryMove'] })
    inst.weapon = this.randomService.getOneRandomItem(weapons)
    const materials = await this.materialRepo.find({ where: { baseMaterial: { id: inst.weapon.material.id } } })
    inst.material = this.randomService.getOneRandomItem(materials)

    if (level > 0) {
      inst.attributes = this.randomService
        .getRandomItems(
          await this.attRepo.find({
            where: [
              { skill: IsNull(), hand: 0 },
              { skill: IsNull(), hand: inst.weapon.hand },
              { skill: inst.weapon.skill, hand: 0 },
              { skill: inst.weapon.skill, hand: inst.weapon.hand }
            ]
          }),
          level,
          null,
          true
        )
        .map((attribute) => {
          const att = new WeaponInstanceAttribute()
          att.attribute = attribute
          att.value = this.randomService.getRandomInRange(attribute.value)
          return att
        })
    }
    return inst
  }
}

registerEntity('WeaponsService', WeaponsService)
