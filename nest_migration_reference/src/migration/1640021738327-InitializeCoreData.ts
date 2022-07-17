import { MigrationInterface, QueryRunner } from 'typeorm'

import ActionFactory from '../api/factories/ActionFactory'
import ArmorAttributeFactory from '../api/factories/ArmorAttributeFactory'
import ArmorClassFactory from '../api/factories/ArmorClassFactory'
import ArmorLocationFactory from '../api/factories/ArmorLocationFactory'
import ClassDamageReductionFactory from '../api/factories/ClassDamageReductionFactory'
import ConditionFactory from '../api/factories/ConditionFactory'
import DamageTypeFactory from '../api/factories/DamageTypeFactory'
import EntityFactory from '../api/factories/EntityFactory'
import EquipLocationFactory from '../api/factories/EquipLocationFactory'
import GemFactory from '../api/factories/GemFactory'
import GemRarityFactory from '../api/factories/GemRarityFactory'
import ItemCategoryFactory from '../api/factories/ItemCategoryFactory'
import JewelryAttributeFactory from '../api/factories/JewelryAttributeFactory'
import JewelryLocationFactory from '../api/factories/JewelryLocationFactory'
import MaterialFactory from '../api/factories/MaterialFactory'
import MaterialTypeFactory from '../api/factories/MaterialTypeFactory'
import MonsterActionFactory from '../api/factories/MonsterActionFactory'
import MonsterClueFactory from '../api/factories/MonsterClueFactory'
import MonsterFactory from '../api/factories/MonsterFactory'
import MonsterLootFactory from '../api/factories/MonsterLootFactory'
import SkillFactory from '../api/factories/SkillFactory'
import SlayerTypeFactory from '../api/factories/SlayerTypeFactory'
import SpecialMoveFactory from '../api/factories/SpecialMoveFactory'
import SpellbookAttributeFactory from '../api/factories/SpellbookAttributeFactory'
import UserFactory from '../api/factories/UserFactory'
import WeaponAttributeFactory from '../api/factories/WeaponAttributeFactory'
import WeaponFactory from '../api/factories/WeaponFactory'
import WeaponSkillFactory from '../api/factories/WeaponSkillFactory'
import { ActionSeed } from '../seed/Action.seed'
import { ArmorAttributeSeed } from '../seed/ArmorAttribute.seed'
import { ArmorClassSeed } from '../seed/ArmorClass.seed'
import { ArmorLocationSeed } from '../seed/ArmorLocation.seed'
import { ClassDamageReductionSeed } from '../seed/ClassDamageReduction.seed'
import { ConditionSeed } from '../seed/Condition.seed'
import { DamageTypeSeed } from '../seed/DamageType.seed'
import { EquipLocationSeed } from '../seed/EquipLocation.seed'
import { GemSeed } from '../seed/Gem.seed'
import { GemRaritySeed } from '../seed/GemRarity.seed'
import { ItemCategorySeed } from '../seed/ItemCategory.seed'
import { JewelryAttributeSeed } from '../seed/JewelryAttribute.seed'
import { JewelryLocationSeed } from '../seed/JewelryLocation.seed'
import { MaterialSeed } from '../seed/Material.seed'
import { MaterialTypeSeed } from '../seed/MaterialType.seed'
import { MonsterSeed } from '../seed/Monster.seed'
import { MonsterActionSeed } from '../seed/MonsterAction.seed'
import { SkillSeed } from '../seed/Skill.seed'
import { SlayerTypeSeed } from '../seed/SlayerType.seed'
import { SpecialMoveSeed } from '../seed/SpecialMove.seed'
import { SpellbookAttributeSeed } from '../seed/SpellbookAttribute.seed'
import { WeaponSeed } from '../seed/Weapon.seed'
import { WeaponAttributeSeed } from '../seed/WeaponAttribute.seed'
import { WeaponSkillSeed } from '../seed/WeaponSkill.seed'
import EntityBase from '../utils/entities/EntityBase'

export class InitializeCoreData1640021738327 implements MigrationInterface {
  protected factories: EntityFactory<EntityBase>[] = [
    new ActionFactory(),
    new ArmorAttributeFactory(),
    new ArmorClassFactory(),
    new ArmorLocationFactory(),
    new ClassDamageReductionFactory(),
    new ConditionFactory(),
    new DamageTypeFactory(),
    new EquipLocationFactory(),
    new GemFactory(),
    new GemRarityFactory(),
    new ItemCategoryFactory(),
    new JewelryAttributeFactory(),
    new JewelryLocationFactory(),
    new MaterialFactory(),
    new MaterialTypeFactory(),
    new MonsterActionFactory(),
    new MonsterClueFactory(),
    new MonsterFactory(),
    new MonsterLootFactory(),
    new SkillFactory(),
    new SlayerTypeFactory(),
    new SpecialMoveFactory(),
    new SpellbookAttributeFactory(),
    new UserFactory(),
    new WeaponAttributeFactory(),
    new WeaponFactory(),
    new WeaponSkillFactory()
  ]

  public async up(queryRunner: QueryRunner): Promise<void> {
    await new ArmorAttributeFactory().createAll(ArmorAttributeSeed)
    await new ArmorClassFactory().createAll(ArmorClassSeed)
    const equipLocation = new EquipLocationFactory()
    await equipLocation.createAll(EquipLocationSeed)
    const armorLocation = new ArmorLocationFactory()
    for (const source of ArmorLocationSeed) {
      const item = {
        id: source.id,
        name: source.name,
        location: { id: source.location }
      }
      await armorLocation.create(item)
    }
    await new DamageTypeFactory().createAll(DamageTypeSeed)
    const classDmgReduction = new ClassDamageReductionFactory()
    for (const source of ClassDamageReductionSeed) {
      const item = {
        id: source.id,
        level: source.level,
        reduction: source.reduction,
        armorClass: { id: source.armorClass },
        damageType: { id: source.damageType }
      }
      await classDmgReduction.create(item)
    }
    const condition = new ConditionFactory()
    for (const source of ConditionSeed) {
      const item = {
        id: source.id,
        name: source.name,
        actionReplace: source.actionReplace,
        duration: source.duration,
        damage: source.damage,
        delay: source.delay,
        cooldown: source.cooldown,
        removeOnHit: source.removeOnHit,
        allowMultiple: source.allowMultiple,
        damageType: { id: source.damageType }
      }
      await condition.create(item)
    }
    await new ActionFactory().createAll(ActionSeed)
    const monster = new MonsterFactory()
    for (const source of MonsterSeed) {
      const item = {
        id: source.id,
        name: source.name,
        hoverStats: source.hoverStats,
        karma: source.karma,
        gold: source.gold,
        alignment: source.alignment,
        hp: source.hp,
        bard: source.bard,
        taming: source.taming,
        resistF: source.resistF,
        resistC: source.resistC,
        resistP: source.resistP,
        resistE: source.resistE,
        resistPh: source.resistPh,
        magery: source.magery,
        evalInt: source.evalInt,
        aggroPriority: source.aggroPriority,
        tactics: source.tactics,
        resistSpell: source.resistSpell,
        anatomy: source.anatomy,
        strength: source.strength,
        dexterity: source.dexterity,
        intelligence: source.intelligence,
        baseDmg: source.baseDmg,
        preferredFood: source.preferredFood,
        controlSlots: source.controlSlots,
        specials: source.specials,
        animate: source.animate,
        packInstinct: source.packInstinct,
        damageType: { id: source.damageType },
        breathDmgType: { id: source.breathDmgType },
        tracking: ''
      }
      await monster.create(item)
    }
    const monsterAction = new MonsterActionFactory()
    for (const source of MonsterActionSeed) {
      const item = {
        id: source.id,
        value: source.value,
        description: source.description,
        weight: source.weight,
        monster: { id: source.monster },
        action: { id: source.action }
      }
      await monsterAction.create(item)
    }
    await new ItemCategoryFactory().createAll(ItemCategorySeed)
    await new GemRarityFactory().createAll(GemRaritySeed)
    const gem = new GemFactory()
    for (const source of GemSeed) {
      const item = {
        id: source.id,
        name: source.name,
        weight: source.weight,
        image: source.image,
        level: source.level,
        rarity: { id: source.rarity },
        category: { id: 1 }
      }
      await gem.create(item)
    }
    await new JewelryAttributeFactory().createAll(JewelryAttributeSeed)
    const jewelryLocation = new JewelryLocationFactory()
    for (const source of JewelryLocationSeed) {
      const item = {
        id: source.id,
        name: source.name,
        location: { id: source.location }
      }
      await jewelryLocation.create(item)
    }
    await new MaterialTypeFactory().createAll(MaterialTypeSeed)
    const material = new MaterialFactory()
    for (const source of MaterialSeed) {
      const item = {
        id: source.id,
        name: source.name,
        weaponDurability: source.weaponDurability,
        canSpawn: source.canSpawn,
        base: { id: source.base }
      }
      await material.create(item)
    }
    await new SkillFactory().createAll(SkillSeed)
    await new SpellbookAttributeFactory().createAll(SpellbookAttributeSeed)
    await new SlayerTypeFactory().createAll(SlayerTypeSeed)
    await new SpecialMoveFactory().createAll(SpecialMoveSeed)
    await new WeaponSkillFactory().createAll(WeaponSkillSeed)
    const weapon = new WeaponFactory()
    for (const source of WeaponSeed) {
      const item = {
        id: source.id,
        name: source.name,
        damage: source.damage,
        range: source.range,
        speed: source.speed,
        strength: source.strength,
        hand: source.hand,
        skill: { id: source.skill },
        primaryMove: { id: source.primaryMove },
        secondaryMove: { id: source.secondaryMove },
        material: { id: source.material }
      }
      await weapon.create(item)
    }
    const weaponAttribute = new WeaponAttributeFactory()
    for (const source of WeaponAttributeSeed) {
      const item = {
        id: source.id,
        name: source.name,
        value: source.value,
        hand: source.hand,
        skill: { id: source.skill }
      }
      await weaponAttribute.create(item)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return
  }
}
