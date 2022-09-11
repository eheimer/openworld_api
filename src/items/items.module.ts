import { Module } from '@nestjs/common'
import { ArmorController } from './armor.controller'
import { InventoryController } from './inventory.controller'
import { JewelryController } from './jewelry.controller'
import { SpellbooksController } from './spellbooks.controller'
import { WeaponsController } from './weapons.controller'
import { ArmorService } from './armor.service'
import { InventoryService } from './inventory.service'
import { JewelryService } from './jewelry.service'
import { SpellbooksService } from './spellbooks.service'
import { WeaponsService } from './weapons.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Armor } from './entities/armor.entity'
import { Inventory } from './entities/inventory.entity'
import { Jewelry } from './entities/jewelry.entity'
import { Spellbook } from './entities/spellbook.entity'
import { Weapon } from './entities/weapon.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Armor, Inventory, Jewelry, Spellbook, Weapon])],
  controllers: [ArmorController, InventoryController, JewelryController, SpellbooksController, WeaponsController],
  providers: [ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService]
})
export class ItemsModule {}
