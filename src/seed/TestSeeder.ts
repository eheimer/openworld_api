import { UserFactory } from "../api/factories/UserFactory"
import { EntityBase } from "../utils/entities/EntityBase"
import { ActionFactory } from "../api/factories/ActionFactory"
import { ArmorAttributeFactory } from "../api/factories/ArmorAttributeFactory"
import { ArmorClassFactory } from "../api/factories/ArmorClassFactory"
import { ArmorLocationFactory } from "../api/factories/ArmorLocationFactory"
import { ClassDamageReductionFactory } from "../api/factories/ClassDamageReductionFactory"
import { ConditionFactory } from "../api/factories/ConditionFactory"
import { DamageTypeFactory } from "../api/factories/DamageTypeFactory"
import { EntityFactory } from "../api/factories/EntityFactory"
import { EquipLocationFactory } from "../api/factories/EquipLocationFactory"
import { GemFactory } from "../api/factories/GemFactory"
import { GemRarityFactory } from "../api/factories/GemRarityFactory"
import { ItemCategoryFactory } from "../api/factories/ItemCategoryFactory"
import { JewelryAttributeFactory } from "../api/factories/JewelryAttributeFactory"
import { JewelryLocationFactory } from "../api/factories/JewelryLocationFactory"
import { MaterialFactory } from "../api/factories/MaterialFactory"
import { MaterialTypeFactory } from "../api/factories/MaterialTypeFactory"
import { MonsterActionFactory } from "../api/factories/MonsterActionFactory"
import { MonsterClueFactory } from "../api/factories/MonsterClueFactory"
import { MonsterFactory } from "../api/factories/MonsterFactory"
import { MonsterLootFactory } from "../api/factories/MonsterLootFactory"
import { SkillFactory } from "../api/factories/SkillFactory"
import { SlayerTypeFactory } from "../api/factories/SlayerTypeFactory"
import { SpecialMoveFactory } from "../api/factories/SpecialMoveFactory"
import { SpellbookAttributeFactory } from "../api/factories/SpellbookAttributeFactory"
import { WeaponAttributeFactory } from "../api/factories/WeaponAttributeFactory"
import { WeaponFactory } from "../api/factories/WeaponFactory"
import { WeaponSkillFactory } from "../api/factories/WeaponSkillFactory"

/**
 * Seeds the database with fabricated test data
 */
export class TestSeeder {
    static async seed(): Promise<boolean> {
        const factories: EntityFactory<EntityBase>[] = [new ActionFactory, new ArmorAttributeFactory, new ArmorClassFactory,
            new ArmorLocationFactory, new ClassDamageReductionFactory, new ConditionFactory, new DamageTypeFactory,
            new EquipLocationFactory, new GemFactory, new GemRarityFactory, new ItemCategoryFactory, new JewelryAttributeFactory,
            new JewelryLocationFactory, new MaterialFactory, new MaterialTypeFactory, new MonsterActionFactory,
            new MonsterClueFactory, new MonsterFactory, new MonsterLootFactory, new SkillFactory, new SlayerTypeFactory,
            new SpecialMoveFactory, new SpellbookAttributeFactory, new UserFactory, new WeaponAttributeFactory, new WeaponFactory,
            new WeaponSkillFactory,
        ]
        factories.forEach(async factory => {
            for (let i = 0; i < 10; i++){
                await factory.createDummy()
            }
        })
        return true
    }
}