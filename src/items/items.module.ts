import { Module } from '@nestjs/common'
import { ArmorController } from './armor/armor.controller'
import { InventoryController } from './inventory.controller'
import { JewelryController } from './jewelry/jewelry.controller'
import { SpellbooksController } from './spellbooks/spellbooks.controller'
import { WeaponsController } from './weapons.controller'
import { ArmorService } from './armor/armor.service'
import { InventoryService } from './inventory.service'
import { JewelryService } from './jewelry/jewelry.service'
import { SpellbooksService } from './spellbooks/spellbooks.service'
import { WeaponsService } from './weapons.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Inventory } from './entities/inventory.entity'
import EquipLocation from '../../nest_migration_reference/src/api/models/_completed/EquipLocation'
import ItemCategory from '../../nest_migration_reference/src/api/models/_completed/ItemCategory'

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, EquipLocation, ItemCategory])],
  controllers: [ArmorController, InventoryController, JewelryController, SpellbooksController, WeaponsController],
  providers: [ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService]
})
export class ItemsModule {}
