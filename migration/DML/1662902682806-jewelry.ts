import { MigrationInterface, QueryRunner } from 'typeorm'
import { GemRaritySeed } from '../../src/items/jewelry/seed/GemRarity.seed'
import { GemSeed } from '../../src/items/jewelry/seed/Gem.seed'
import { ItemCategorySeed } from '../../src/items/seed/ItemCategory.seed'
import { JewelryAttributeSeed } from '../../src/items/jewelry/seed/JewelryAttribute.seed'
import { JewelryLocationSeed } from '../../src/items/jewelry/seed/JewelryLocation.seed'

export class jewelry1662902682806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // GemRarity
    for (const gemRarity of GemRaritySeed) {
      await queryRunner.query(
        `INSERT INTO \`gem_rarity\` (\`id\`, \`name\`, \`durability\`) VALUES (${gemRarity.id}, '${gemRarity.name}', ${gemRarity.durability})`
      )
    }

    // ItemCategory
    for (const category of ItemCategorySeed) {
      await queryRunner.query(
        `INSERT INTO \`item_category\` (\`id\`, \`name\`) VALUES (${category.id}, '${category.name}')`
      )
    }

    // Gem
    for (const gem of GemSeed) {
      await queryRunner.query(
        `INSERT INTO \`gem\` (\`id\`, \`name\`, \`weight\`, \`image\`, \`level\`, \`rarityId\`, \`categoryId\`) VALUES (${gem.id}, '${gem.name}', ${gem.weight}, '${gem.image}', ${gem.level}, ${gem.rarity}, ${gem.category})`
      )
    }

    //JewelryAttribute
    for (const jewelryAttribute of JewelryAttributeSeed) {
      await queryRunner.query(
        `INSERT INTO \`jewelry_attribute\` (\`id\`, \`name\`, \`value\`) VALUES (${jewelryAttribute.id}, '${jewelryAttribute.name}', '${jewelryAttribute.value}')`
      )
    }

    //JewelryLocation
    for (const jewelryLocation of JewelryLocationSeed) {
      await queryRunner.query(
        `INSERT INTO \`jewelry_location\` (\`id\`, \`name\`, \`locationId\`) VALUES (${jewelryLocation.id}, '${jewelryLocation.name}', ${jewelryLocation.location})`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // JewelryLocation
    for (const jewelryLocation of JewelryLocationSeed) {
      await queryRunner.query(`DELETE FROM \`jewelry_location\` WHERE \`id\` = ${jewelryLocation.id}`)
    }

    // JewelryAttribute
    for (const jewelryAttribute of JewelryAttributeSeed) {
      await queryRunner.query(`DELETE FROM \`jewelry_attribute\` WHERE \`id\` = ${jewelryAttribute.id}`)
    }

    // Gem
    for (const gem of GemSeed) {
      await queryRunner.query(`DELETE FROM \`gem\` WHERE \`id\` = ${gem.id}`)
    }

    // ItemCategory
    for (const category of ItemCategorySeed) {
      await queryRunner.query(`DELETE FROM \`item_category\` WHERE \`id\` = ${category.id}`)
    }

    // GemRarity
    for (const gemRarity of GemRaritySeed) {
      await queryRunner.query(`DELETE FROM \`gem_rarity\` WHERE \`id\` = ${gemRarity.id}`)
    }
  }
}
