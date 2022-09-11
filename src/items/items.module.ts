import { Module } from '@nestjs/common'
import { ArmorController } from './armor/armor.controller'
import { InventoryController } from './inventory.controller'
import { JewelryController } from './jewelry/jewelry.controller'
import { SpellbooksController } from './spellbooks.controller'
import { WeaponsController } from './weapons.controller'
import { ArmorService } from './armor/armor.service'
import { InventoryService } from './inventory.service'
import { JewelryService } from './jewelry/jewelry.service'
import { SpellbooksService } from './spellbooks.service'
import { WeaponsService } from './weapons.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Armor } from './armor/entities/armor.entity'
import { Inventory } from './entities/inventory.entity'
import { Spellbook } from './entities/spellbook.entity'
import { Weapon } from './entities/weapon.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Armor, Inventory, Spellbook, Weapon])],
  controllers: [ArmorController, InventoryController, JewelryController, SpellbooksController, WeaponsController],
  providers: [ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService]
})
export class ItemsModule {}
