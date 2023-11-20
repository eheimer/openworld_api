import { Injectable } from '@nestjs/common'
import { WeaponInstance } from './entities/weapon-instance.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { Weapon } from './entities/weapon.entity'
import { RandomService } from '../../utils/random.service'
import { Material } from './entities/material.entity'
import { WeaponAttribute } from './entities/weapon-attribute.entity'
import { WeaponInstanceAttribute } from './entities/weapon-instance-attribute.entity'

@Injectable()
export class WeaponsService {
  //inject the Weapon repository into the constructor
  constructor(
    @InjectRepository(Weapon)
    private repo: Repository<Weapon>,
    @InjectRepository(Material)
    private materialRepo: Repository<Material>,
    private randomService: RandomService,
    @InjectRepository(WeaponAttribute)
    private attRepo: Repository<WeaponAttribute>
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
