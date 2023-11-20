import { Injectable, Logger } from '@nestjs/common'
import { ArmorInstance } from './entities/armor-instance.entity'
import { ArmorAttribute } from './entities/armor-attribute.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArmorClass } from './entities/armor-class.entity'
import { RandomService } from '../../utils/random.service'
import { ArmorLocation } from './entities/armor-location.entity'
import { ArmorInstanceDamageReduction } from './entities/armor-instance-damage-reduction.entity'
import { ArmorInstanceAttribute } from './entities/armor-instance-attribute.entity'

@Injectable()
export class ArmorService {
  constructor(
    @InjectRepository(ArmorClass)
    private repo: Repository<ArmorClass>,
    private randomService: RandomService,
    @InjectRepository(ArmorAttribute)
    private attRepo: Repository<ArmorAttribute>,
    @InjectRepository(ArmorLocation)
    private locationRepo: Repository<ArmorLocation>
  ) {}

  findAll() {
    return `This action returns all armor`
  }

  findOne(id: number) {
    return `This action returns a #${id} armor`
  }

  // update(id: number, updateArmorDto: UpdateArmorDto) {
  //   return `This action updates a #${id} armor`
  // }

  remove(id: number) {
    return `This action removes a #${id} armor`
  }

  async randomItem(level: number) {
    const inst = new ArmorInstance()
    inst.equipped = false
    inst.damaged = false
    inst.armorClass = this.randomService.getOneRandomItem(
      await this.repo.find({ relations: ['reductions', 'reductions.damageType'] })
    )
    inst.location = this.randomService.getOneRandomItem(await this.locationRepo.find())
    inst.reductions = inst.armorClass.reductions
      .filter((reduc) => reduc.level === level - 1)
      .map((reduc) => {
        const item = new ArmorInstanceDamageReduction()
        item.damageType = reduc.damageType
        item.value = this.randomService.getRandomInRange(reduc.reduction)
        return item
      })
    if (level > 0) {
      inst.attributes = this.randomService
        .getRandomItems(await this.attRepo.find(), level, null, true)
        .map((attribute) => {
          const att = new ArmorInstanceAttribute()
          att.attribute = attribute
          att.value = this.randomService.getRandomInRange(attribute.value)
          return att
        })
    }
    return inst
  }
}
