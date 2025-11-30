import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Inventory } from "./entities/inventory.entity"
import { Repository } from 'typeorm'
import { WeaponInstance } from "./weapons/entities/weapon-instance.entity"
import { ArmorInstance } from "./armor/entities/armor-instance.entity"
import { JewelryInstance } from "./jewelry/entities/jewelry-instance.entity"
import { WeaponsService } from "./weapons/weapons.service"
import { JewelryService } from "./jewelry/jewelry.service"
import { ArmorService } from "./armor/armor.service"
import { RandomService } from "../utils/random.service"
import { getEntity, registerEntity } from "../entityRegistry"

type ItemInstance = WeaponInstance | ArmorInstance | JewelryInstance

interface ItemTypeMap {
  [key: number]: {
    name: string
    type: new () => ItemInstance
    service: WeaponsService | ArmorService | JewelryService
    inventoryContainer: string
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
      service: this.weaponsService,
      inventoryContainer: 'weapons'
    },
    2: {
      name: 'armor',
      type: ArmorInstance,
      service: this.armorService,
      inventoryContainer: 'armor'
    },
    3: {
      name: 'jewelry',
      type: JewelryInstance,
      service: this.jewelryService,
      inventoryContainer: 'jewelry'
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

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: [
        'weapons.weapon.skill',
        'weapons.weapon.primaryMove',
        'weapons.weapon.secondaryMove',
        'weapons.material',
        'weapons.attributes.attribute',
        'armor.armorClass',
        'armor.location.location',
        'armor.attributes.attribute',
        'armor.reductions.damageType',
        'jewelry.gem',
        'jewelry.location.location',
        'jewelry.attributes.attribute'
      ]
    })
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`
  }

  createInventory(limit: boolean) {
    const inventory = this.repo.create({ limit })
    return this.repo.save(inventory)
  }

  async equipItem(inventoryId: number, type: string, itemId: number): Promise<Inventory | undefined> {
    const itemType = this.getItemType(type)
    const inventory = await this.findOne(inventoryId)
    const item = inventory[itemType.inventoryContainer].find((item) => item.id === itemId)
    if (!item) {
      return undefined
    }
    if (itemType.name === 'weapon') {
      inventory.weapons.forEach((weapon) => (weapon.equipped = false))
      // TODO: if the weapon is a two-handed weapon, unequip any shield (shields aren't implemented yet)
    }
    if (itemType.name === 'armor' || itemType.name === 'jewelry') {
      inventory.armor.forEach((armor) => {
        if (armor.location.location.id === item.location.location.id) {
          armor.equipped = false
        }
      })
      inventory.jewelry.forEach((jewelry) => {
        if (jewelry.location.location.id === item.location.location.id) {
          jewelry.equipped = false
        }
      })
    }
    // TODO: if the item is a shield, unequip any two-handed weapon
    item.equipped = true
    return this.repo.save(inventory)
  }

  async unequipItem(inventoryId: number, type: string, itemId: number): Promise<Inventory | undefined> {
    const itemType = this.getItemType(type)
    const inventory = await this.findOne(inventoryId)
    const item = inventory[itemType.inventoryContainer].find((item) => item.id === itemId)
    if (!item) {
      return undefined
    }
    item.equipped = false
    return this.repo.save(inventory)
  }

  async dropItemFromInventory(inventoryId: number, type: string, itemId: number): Promise<Inventory | undefined> {
    const itemType = this.getItemType(type)
    const inventory = await this.findOne(inventoryId)
    const item = inventory[itemType.inventoryContainer].find((item) => item.id === itemId)
    if (!item) {
      return undefined
    }
    inventory[itemType.inventoryContainer] = inventory[itemType.inventoryContainer].filter((item) => item.id !== itemId)
    await itemType.service.removeInstance(item.id)
    return inventory
  }

  //persists an item to the database and adds it to the inventory
  async addItemToInventory(inventoryId: number, item: ItemInstance) {
    const itemType = this.getItemType(item.constructor.name.replace('Instance', '').toLowerCase())
    Logger.log({ item })

    const inventory = await this.findOne(inventoryId)
    inventory[itemType.inventoryContainer].push(item)
    return this.repo.save(inventory)
  }

  //generates a non-persisted item
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

registerEntity('InventoryService', InventoryService)
