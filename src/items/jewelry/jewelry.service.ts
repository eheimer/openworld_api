import { Injectable } from '@nestjs/common'
import { JewelryInstance } from './entities/jewelry-instance.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Gem } from './entities/gem.entity'
import { Repository } from 'typeorm'
import { RandomService } from '../../utils/random.service'
import { JewelryLocation } from './entities/jewelry-location.entity'
import { JewelryAttribute } from './entities/jewelry-attribute.entity'
import { JewelryInstanceAttribute } from './entities/jewelry-instance-attribute.entity'

@Injectable()
export class JewelryService {
  constructor(
    @InjectRepository(Gem) private repo: Repository<Gem>,
    private randomService: RandomService,
    @InjectRepository(JewelryLocation) private locationRepo: Repository<JewelryLocation>,
    @InjectRepository(JewelryAttribute) private attRepo: Repository<JewelryAttribute>,
    @InjectRepository(JewelryInstance) private instanceRepo: Repository<JewelryInstance>,
    @InjectRepository(JewelryInstanceAttribute) private instanceAttRepo: Repository<JewelryInstanceAttribute>
  ) {}
  findAll() {
    return `This action returns all jewelry`
  }

  findOne(id: number) {
    return `This action returns a #${id} jewelry`
  }

  remove(id: number) {
    return `This action removes a #${id} jewelry`
  }

  async removeInstance(id: number) {
    const inst = await this.instanceRepo.findOne({ where: { id }, relations: ['attributes'] })
    inst.attributes.forEach((att) => {
      this.instanceAttRepo.remove(att)
    })
    return this.instanceRepo.remove(inst)
  }

  async randomItem(level: number) {
    const inst = new JewelryInstance()
    inst.equipped = false
    inst.damaged = false
    inst.gem = this.randomService.getOneRandomItem(
      await this.repo.find({ where: { rarity: { id: this.randomService.weightedRandom([0, 9, 1]) } } })
    )
    inst.location = this.randomService.getOneRandomItem(await this.locationRepo.find())
    const attPerLevel = [0, 1, 1, 2, 3]
    if (attPerLevel[level - 1] > 0) {
      inst.attributes = this.randomService
        .getRandomItems(await this.attRepo.find(), attPerLevel[level - 1], null, true)
        .map((attribute: JewelryAttribute) => {
          const att = new JewelryInstanceAttribute()
          att.attribute = attribute
          att.value = this.randomService.getRandomInRange(attribute.value)
          return att
        })
    }
    return inst
  }
}
