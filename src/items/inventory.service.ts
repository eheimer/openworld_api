import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Inventory } from './entities/inventory.entity'
import { Repository } from 'typeorm'
import { WeaponInstance } from './weapons/entities/weapon-instance.entity'
import { ArmorInstance } from './armor/entities/armor-instance.entity'
import { JewelryInstance } from './jewelry/entities/jewelry-instance.entity'
import { WeaponsService } from './weapons/weapons.service'
import { JewelryService } from './jewelry/jewelry.service'
import { ArmorService } from './armor/armor.service'
import { RandomService } from '../utils/random.service'

type ItemInstance = WeaponInstance | ArmorInstance | JewelryInstance

interface ItemTypeMap {
  [key: number]: {
    name: string
    type: new () => ItemInstance
    service: WeaponsService | ArmorService | JewelryService
  }
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private repo: Repository<Inventory>,
    private weaponsService: WeaponsService,
    private armorService: ArmorService,
    private jewelryService: JewelryService,
    private randomService: RandomService
  ) {}

  itemTypes: ItemTypeMap = {
    1: {
      name: 'weapon',
      type: WeaponInstance,
      service: this.weaponsService
    },
    2: {
      name: 'armor',
      type: ArmorInstance,
      service: this.armorService
    },
    3: {
      name: 'jewelry',
      type: JewelryInstance,
      service: this.jewelryService
    }
  }

  getItemType(key: number | string): ItemTypeMap[number] | undefined {
    if (typeof key === 'string' && key.match(/^\d+$/)) {
      key = parseInt(key)
    }
    if (typeof key === 'number') {
      return this.itemTypes[key]
    } else {
      return Object.values(this.itemTypes).find((item) => item.name === key)
    }
  }

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`
  }

  createInventory(limit: boolean) {
    const inventory = this.repo.create({ limit })
    return this.repo.save(inventory)
  }

  async randomItem(type: number | string, level: number) {
    if (!type) {
      type = this.randomService.getOneRandomItem(Object.keys(this.itemTypes))
    }
    const itemType = this.getItemType(type)
    if (!itemType) {
      throw new Error(`Invalid item type ${type}`)
    }
    return await itemType.service.randomItem(level)
  }
}
