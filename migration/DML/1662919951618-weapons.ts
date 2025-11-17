import { MigrationInterface, QueryRunner } from 'typeorm'
import { MaterialSeed } from '../../src/items/weapons/seed/Material.seed.ts'
import { MaterialTypeSeed } from '../../src/items/weapons/seed/MaterialType.seed.ts'
import { SpecialMoveSeed } from '../../src/items/weapons/seed/SpecialMove.seed.ts'
import { WeaponSkillSeed } from '../../src/items/weapons/seed/WeaponSkill.seed.ts'
import { WeaponSeed } from '../../src/items/weapons/seed/Weapon.seed.ts'
import { WeaponAttributeSeed } from '../../src/items/weapons/seed/WeaponAttribute.seed.ts'

export class weapons1662919951618 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const seed of MaterialTypeSeed) {
      await queryRunner.query(`INSERT INTO \`material_type\` (\`id\`, \`name\`) VALUES (${seed.id}, '${seed.name}')`)
    }
    for (const seed of MaterialSeed) {
      await queryRunner.query(
        `INSERT INTO \`material\` (\`id\`, \`name\`, \`weaponDurability\`, \`canSpawn\`, \`baseMaterialId\`) VALUES (${seed.id}, '${seed.name}', ${seed.weaponDurability}, ${seed.canSpawn}, ${seed.base})`
      )
    }
    for (const seed of SpecialMoveSeed) {
      await queryRunner.query(
        `INSERT INTO \`special_move\` (\`id\`, \`name\`, \`stamina\`) VALUES (${seed.id}, '${seed.name}', ${seed.stamina})`
      )
    }
    for (const seed of WeaponSkillSeed) {
      await queryRunner.query(`INSERT INTO \`weapon_skill\` (\`id\`, \`name\`) VALUES (${seed.id}, '${seed.name}')`)
    }
    for (const seed of WeaponSeed) {
      await queryRunner.query(
        `INSERT INTO \`weapon\` (\`id\`, \`name\`, \`damage\`, \`range\`, \`speed\`, \`strength\`, \`hand\`, \`skillId\`, \`primaryMoveId\`, \`secondaryMoveId\`, \`materialId\`) VALUES (${seed.id}, '${seed.name}', ${seed.damage}, ${seed.range}, ${seed.speed}, ${seed.strength}, ${seed.hand}, ${seed.skill}, ${seed.primaryMove}, ${seed.secondaryMove}, ${seed.material})`
      )
    }
    for (const seed of WeaponAttributeSeed) {
      await queryRunner.query(
        `INSERT INTO \`weapon_attribute\` (\`id\`, \`name\`, \`value\`, \`hand\`, \`skillId\`) VALUES (${seed.id}, '${seed.name}', '${seed.value}', ${seed.hand}, ${seed.skill})`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const seed of WeaponAttributeSeed) {
      await queryRunner.query(`DELETE FROM \`weapon_attribute\` WHERE \`id\` = ${seed.id}`)
    }
    for (const seed of WeaponSeed) {
      await queryRunner.query(`DELETE FROM \`weapon\` WHERE \`id\` = ${seed.id}`)
    }
    for (const seed of WeaponSkillSeed) {
      await queryRunner.query(`DELETE FROM \`weapon_skill\` WHERE \`id\` = ${seed.id}`)
    }
    for (const seed of SpecialMoveSeed) {
      await queryRunner.query(`DELETE FROM \`special_move\` WHERE \`id\` = ${seed.id}`)
    }
    for (const seed of MaterialSeed) {
      await queryRunner.query(`DELETE FROM \`material\` WHERE \`id\` = ${seed.id}`)
    }
  }
}
