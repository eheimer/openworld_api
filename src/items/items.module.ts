import { Module } from '@nestjs/common'
import { ArmorController } from "./armor/armor.controller.js"
import { InventoryController } from "./inventory.controller.js"
import { JewelryController } from "./jewelry/jewelry.controller.js"
import { SpellbooksController } from "./spellbooks/spellbooks.controller.js"
import { WeaponsController } from "./weapons/weapons.controller.js"
import { ArmorService } from "./armor/armor.service.js"
import { InventoryService } from "./inventory.service.js"
import { JewelryService } from "./jewelry/jewelry.service.js"
import { SpellbooksService } from "./spellbooks/spellbooks.service.js"
import { WeaponsService } from "./weapons/weapons.service.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { Inventory } from "./entities/inventory.entity.js"
import { RandomService } from "../utils/random.service.js"
import { ArmorAttribute } from "./armor/entities/armor-attribute.entity.js"
import { ArmorLocation } from "./armor/entities/armor-location.entity.js"
import { Gem } from "./jewelry/entities/gem.entity.js"
import { JewelryLocation } from "./jewelry/entities/jewelry-location.entity.js"
import { JewelryAttribute } from "./jewelry/entities/jewelry-attribute.entity.js"
import { Material } from "./weapons/entities/material.entity.js"
import { WeaponAttribute } from "./weapons/entities/weapon-attribute.entity.js"
import { Weapon } from "./weapons/entities/weapon.entity.js"
import { ArmorClass } from "./armor/entities/armor-class.entity.js"
import { CharactersService } from "../games/characters/characters.service.js"
import { Character } from "../games/characters/entities/character.entity.js"
import { ArmorInstance } from "./armor/entities/armor-instance.entity.js"
import { JewelryInstance } from "./jewelry/entities/jewelry-instance.entity.js"
import { WeaponInstance } from "./weapons/entities/weapon-instance.entity.js"
import { ArmorInstanceAttribute } from "./armor/entities/armor-instance-attribute.entity.js"
import { ArmorInstanceDamageReduction } from "./armor/entities/armor-instance-damage-reduction.entity.js"
import { JewelryInstanceAttribute } from "./jewelry/entities/jewelry-instance-attribute.entity.js"
import { WeaponInstanceAttribute } from "./weapons/entities/weapon-instance-attribute.entity.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      ArmorInstance,
      ArmorInstanceAttribute,
      ArmorInstanceDamageReduction,
      ArmorClass,
      ArmorAttribute,
      ArmorLocation,
      JewelryInstance,
      JewelryInstanceAttribute,
      Gem,
      JewelryLocation,
      JewelryAttribute,
      WeaponInstance,
      WeaponInstanceAttribute,
      Weapon,
      Material,
      WeaponAttribute,
      Character
    ])
  ],
  controllers: [ArmorController, InventoryController, JewelryController, SpellbooksController, WeaponsController],
  providers: [
    CharactersService,
    RandomService,
    ArmorService,
    InventoryService,
    JewelryService,
    SpellbooksService,
    WeaponsService
  ],
  exports: [ArmorService, InventoryService, JewelryService, SpellbooksService, WeaponsService]
})
export class ItemsModule {}

registerEntity('ItemsModule', ItemsModule)
