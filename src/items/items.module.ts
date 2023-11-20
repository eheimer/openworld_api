import { Module } from '@nestjs/common'
import { ArmorController } from './armor/armor.controller'
import { InventoryController } from './inventory.controller'
import { JewelryController } from './jewelry/jewelry.controller'
import { SpellbooksController } from './spellbooks/spellbooks.controller'
import { WeaponsController } from './weapons/weapons.controller'
import { ArmorService } from './armor/armor.service'
import { InventoryService } from './inventory.service'
import { JewelryService } from './jewelry/jewelry.service'
import { SpellbooksService } from './spellbooks/spellbooks.service'
import { WeaponsService } from './weapons/weapons.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Inventory } from './entities/inventory.entity'
import { RandomService } from '../utils/random.service'
import { ArmorAttribute } from './armor/entities/armor-attribute.entity'
import { ArmorLocation } from './armor/entities/armor-location.entity'
import { Gem } from './jewelry/entities/gem.entity'
import { JewelryLocation } from './jewelry/entities/jewelry-location.entity'
import { JewelryAttribute } from './jewelry/entities/jewelry-attribute.entity'
import { Material } from './weapons/entities/material.entity'
import { WeaponAttribute } from './weapons/entities/weapon-attribute.entity'
import { Weapon } from './weapons/entities/weapon.entity'
import { ArmorClass } from './armor/entities/armor-class.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      ArmorClass,
      ArmorAttribute,
      ArmorLocation,
      Gem,
      JewelryLocation,
      JewelryAttribute,
      Weapon,
      Material,
      WeaponAttribute
    ])
  ],
  controllers: [ArmorController, InventoryController, JewelryController, SpellbooksController, WeaponsController],
  providers: [RandomService, ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService],
  exports: [ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService]
})
export class ItemsModule {}
