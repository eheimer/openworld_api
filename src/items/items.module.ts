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

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [ArmorController, InventoryController, JewelryController, SpellbooksController, WeaponsController],
  providers: [ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService],
  exports: [ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService]
})
export class ItemsModule {}
