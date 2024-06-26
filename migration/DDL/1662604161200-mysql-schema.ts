import { MigrationInterface, QueryRunner } from 'typeorm'

export class mysqlSchema1662604161200 implements MigrationInterface {
  name = 'mysqlSchema1662604161200'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`game\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`ownerId\` int NOT NULL, UNIQUE INDEX \`IDX_5d1e08e04b97aa06d671cd5840\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`player\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`isAdmin\` tinyint NOT NULL DEFAULT 0, \`lastSeenAt\` datetime NULL, \`currentGameId\` int NULL, UNIQUE INDEX \`IDX_331aaf0d7a5a45f9c74cc699ea\` (\`username\`), UNIQUE INDEX \`IDX_19b3d69e0f058936531e3965b7\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`damage_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`chaos\` tinyint NOT NULL, \`display\` tinyint NOT NULL, \`soundurl\` varchar(255) NOT NULL, \`imgurl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`action\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`value\` int NULL, \`description\` text NOT NULL, \`initiative\` int NOT NULL, \`spellDmgRange\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`monster_action\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`value\` int NOT NULL, \`description\` text NOT NULL, \`weight\` int NOT NULL, \`monsterId\` int NULL, \`actionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`slayer_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`monster\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`hoverStats\` text NOT NULL, \`karma\` varchar(255) NOT NULL, \`gold\` varchar(255) NOT NULL, \`alignment\` varchar(255) NOT NULL, \`hp\` varchar(255) NOT NULL, \`bard\` varchar(255) NOT NULL, \`taming\` varchar(255) NOT NULL, \`resistF\` varchar(255) NOT NULL, \`resistC\` varchar(255) NOT NULL, \`resistP\` varchar(255) NOT NULL, \`resistE\` varchar(255) NOT NULL, \`resistPh\` varchar(255) NOT NULL, \`magery\` varchar(255) NOT NULL, \`evalInt\` varchar(255) NOT NULL, \`aggroPriority\` int NOT NULL, \`tactics\` varchar(255) NOT NULL, \`resistSpell\` varchar(255) NOT NULL, \`anatomy\` varchar(255) NOT NULL, \`strength\` varchar(255) NOT NULL, \`dexterity\` varchar(255) NOT NULL, \`intelligence\` varchar(255) NOT NULL, \`baseDmg\` varchar(255) NOT NULL, \`preferredFood\` varchar(255) NOT NULL, \`controlSlots\` int NOT NULL, \`specials\` text NOT NULL, \`animate\` tinyint NOT NULL, \`packInstinct\` varchar(255) NOT NULL, \`tracking\` varchar(255) NOT NULL DEFAULT '', \`damageTypeId\` int NULL, \`breathDmgTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`condition\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`actionReplace\` varchar(255) NOT NULL, \`duration\` int NOT NULL, \`damage\` varchar(255) NOT NULL, \`delay\` int NOT NULL, \`cooldown\` int NOT NULL, \`removeOnHit\` tinyint NOT NULL, \`allowMultiple\` tinyint NOT NULL, \`damageTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`monster_condition\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roundsRemaining\` int NOT NULL, \`cooldownRemaining\` int NOT NULL, \`damage\` int NULL, \`conditionId\` int NOT NULL, \`targetId\` int NULL, \`creatureId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`armor_class_damage_reduction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`level\` int NOT NULL, \`reduction\` varchar(255) NOT NULL, \`armorClassId\` int NULL, \`damageTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`armor_class\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`durability\` int NOT NULL, \`reductionsId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`armor_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`armor_instance_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`value\` int NOT NULL, \`armorId\` int NULL, \`attributeId\` int NOT NULL, \`damageTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`armor_instance_damage_reduction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`value\` int NOT NULL, \`armorId\` int NULL, \`damageTypeId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`equip_location\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`armor_location\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`locationId\` int NULL, UNIQUE INDEX \`REL_9b56af5a233f83408a29eaf70a\` (\`locationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`armor_instance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`equipped\` tinyint NOT NULL, \`damaged\` tinyint NOT NULL, \`armorClassId\` int NOT NULL, \`locationId\` int NOT NULL, \`inventoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`gem_rarity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`durability\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`item_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`gem\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`weight\` int NOT NULL, \`image\` varchar(255) NOT NULL, \`level\` int NOT NULL, \`rarityId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`skill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`spellbook\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`jewelry_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`jewelry_instance_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`value\` int NOT NULL, \`jewelryId\` int NULL, \`attributeId\` int NOT NULL, \`skillId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`jewelry_location\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`locationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`jewelry_instance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`equipped\` tinyint NOT NULL, \`damaged\` tinyint NOT NULL, \`gemId\` int NOT NULL, \`locationId\` int NOT NULL, \`inventoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`spellbook_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`spellbook_instance_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`value\` int NOT NULL, \`attributeId\` int NOT NULL, \`skillId\` int NULL, \`slayerId\` int NULL, \`spellbookId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`spellbook_instance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`inventoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`material_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`material\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`weaponDurability\` int NOT NULL, \`canSpawn\` tinyint NOT NULL, \`baseMaterialId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`weapon_skill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`weapon_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`hand\` int NOT NULL, \`skillId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`weapon_instance_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`value\` int NOT NULL, \`weaponId\` int NULL, \`attributeId\` int NOT NULL, \`slayerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`special_move\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`stamina\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`weapon\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`damage\` varchar(255) NOT NULL, \`range\` int NOT NULL, \`speed\` int NOT NULL, \`strength\` int NOT NULL, \`hand\` int NOT NULL, \`skillId\` int NULL, \`primaryMoveId\` int NULL, \`secondaryMoveId\` int NULL, \`materialId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`weapon_instance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`equipped\` tinyint NOT NULL, \`damaged\` tinyint NOT NULL, \`weaponId\` int NOT NULL, \`materialId\` int NOT NULL, \`inventoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`inventory\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`limit\` tinyint NOT NULL DEFAULT 0, \`gold\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`monster_instance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`orighp\` int NOT NULL, \`hp\` int NOT NULL, \`magery\` int NOT NULL, \`evalInt\` int NOT NULL, \`tactics\` int NOT NULL, \`resistSpell\` int NOT NULL, \`anatomy\` int NOT NULL, \`strength\` int NOT NULL, \`dexterity\` int NOT NULL, \`intelligence\` int NOT NULL, \`baseDmg\` varchar(255) NOT NULL, \`initiative\` int NOT NULL, \`tamed\` tinyint NOT NULL, \`actionName\` varchar(255) NOT NULL, \`actionValue\` int NOT NULL, \`actionDescription\` text NOT NULL, \`actionDmgAmount\` int NOT NULL, \`hoverStats\` varchar(255) NOT NULL, \`specials\` varchar(255) NOT NULL, \`animate\` tinyint NOT NULL, \`counter\` int NOT NULL, \`meleeDmg\` int NOT NULL, \`tameName\` varchar(255) NOT NULL, \`stomach\` int NOT NULL, \`appetite\` int NOT NULL, \`obedience\` int NOT NULL, \`tracking\` int NOT NULL, \`resistPh\` int NOT NULL, \`resistC\` int NOT NULL, \`resistE\` int NOT NULL, \`resistF\` int NOT NULL, \`resistP\` int NOT NULL, \`battleAsEnemyId\` int NULL, \`battleAsFriendlyId\` int NULL, \`ownerId\` int NULL, \`monsterId\` int NOT NULL, \`nextActionId\` int NULL, \`actionDamageTypeId\` int NULL, \`lootId\` int NULL, UNIQUE INDEX \`REL_4ca8daa3cbd0d30203c14e45ae\` (\`lootId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`character_condition\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roundsRemaining\` int NOT NULL, \`cooldownRemaining\` int NOT NULL, \`damage\` int NULL, \`conditionId\` int NOT NULL, \`targetId\` int NULL, \`characterId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`race_skill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`level\` int NOT NULL, \`raceId\` int NULL, \`skillId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`race\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`description\` text NOT NULL, \`name\` varchar(255) NOT NULL, \`movement\` varchar(255) NOT NULL, \`hpReplenish\` int NOT NULL, \`manaReplenish\` int NOT NULL, \`staminaReplenish\` int NOT NULL, \`hunger\` int NULL, \`sleep\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`character_skill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`level\` int NOT NULL DEFAULT '1', \`characterId\` int NOT NULL, \`skillId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`character\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`hp\` int NOT NULL DEFAULT '1', \`mana\` int NOT NULL DEFAULT '0', \`strength\` int NOT NULL, \`dexterity\` int NOT NULL, \`intelligence\` int NOT NULL, \`sleep\` int NOT NULL DEFAULT '1', \`hunger\` int NOT NULL DEFAULT '1', \`stamina\` int NOT NULL DEFAULT '1', \`raceId\` int NULL, \`gameId\` int NOT NULL, \`playerId\` int NOT NULL, \`inventoryId\` int NOT NULL, UNIQUE INDEX \`REL_13fba937ad130d9285e0f28686\` (\`inventoryId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`battle\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`round\` int NOT NULL DEFAULT '1', \`gameId\` int NOT NULL, \`initiatorId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`player_games_game\` (\`playerId\` int NOT NULL, \`gameId\` int NOT NULL, INDEX \`IDX_2718b3b614632ea1ce019e8ec1\` (\`playerId\`), INDEX \`IDX_70cf03c195b3ff8652320e40a9\` (\`gameId\`), PRIMARY KEY (\`playerId\`, \`gameId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`monster_slayers_slayer_type\` (\`monsterId\` int NOT NULL, \`slayerTypeId\` int NOT NULL, INDEX \`IDX_2e2e6923869b90fd6c65558c15\` (\`monsterId\`), INDEX \`IDX_bbd834561b870c6049e80b7e2b\` (\`slayerTypeId\`), PRIMARY KEY (\`monsterId\`, \`slayerTypeId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`condition_overrides_condition\` (\`conditionId_1\` int NOT NULL, \`conditionId_2\` int NOT NULL, INDEX \`IDX_b74b22dfc4b885ca55f5914d36\` (\`conditionId_1\`), INDEX \`IDX_6a083e2fd9df823e15686f3004\` (\`conditionId_2\`), PRIMARY KEY (\`conditionId_1\`, \`conditionId_2\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`battle_participants_character\` (\`battleId\` int NOT NULL, \`characterId\` int NOT NULL, INDEX \`IDX_10e745f65df54dea13dd5be754\` (\`battleId\`), INDEX \`IDX_a4688b0786211e3b51c5d01b6d\` (\`characterId\`), PRIMARY KEY (\`battleId\`, \`characterId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_d05575b5a28ec6dad65c2aef301\` FOREIGN KEY (\`ownerId\`) REFERENCES \`player\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`player\` ADD CONSTRAINT \`FK_a685e5d5fc1676a8bcd05e681cc\` FOREIGN KEY (\`currentGameId\`) REFERENCES \`game\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_action\` ADD CONSTRAINT \`FK_b8aad316d39b87ceb1065028cfd\` FOREIGN KEY (\`monsterId\`) REFERENCES \`monster\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_action\` ADD CONSTRAINT \`FK_66e50e885cfcf9bf9155e561c94\` FOREIGN KEY (\`actionId\`) REFERENCES \`action\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster\` ADD CONSTRAINT \`FK_572eb283f5e63eb6350aa93e0b8\` FOREIGN KEY (\`damageTypeId\`) REFERENCES \`damage_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster\` ADD CONSTRAINT \`FK_10fa8ba1b89415844585423dea3\` FOREIGN KEY (\`breathDmgTypeId\`) REFERENCES \`damage_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`condition\` ADD CONSTRAINT \`FK_a9a00b82a00b60a38dde793c3cf\` FOREIGN KEY (\`damageTypeId\`) REFERENCES \`damage_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_condition\` ADD CONSTRAINT \`FK_e7a29847a1751a1467d24434f3d\` FOREIGN KEY (\`conditionId\`) REFERENCES \`condition\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_condition\` ADD CONSTRAINT \`FK_dc225a588847769fdc99bc5f51f\` FOREIGN KEY (\`targetId\`) REFERENCES \`monster_instance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_condition\` ADD CONSTRAINT \`FK_4a316650c8248dd45d4a1e6000b\` FOREIGN KEY (\`creatureId\`) REFERENCES \`monster_instance\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_class_damage_reduction\` ADD CONSTRAINT \`FK_487d2a8f99c619b4535d2ec023b\` FOREIGN KEY (\`armorClassId\`) REFERENCES \`armor_class\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_class_damage_reduction\` ADD CONSTRAINT \`FK_55187e994e82f93943f254b1307\` FOREIGN KEY (\`damageTypeId\`) REFERENCES \`damage_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_class\` ADD CONSTRAINT \`FK_c89160171695ce4026c827fac88\` FOREIGN KEY (\`reductionsId\`) REFERENCES \`armor_class_damage_reduction\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_attribute\` ADD CONSTRAINT \`FK_a48388ff1e07be7af2710db00f4\` FOREIGN KEY (\`armorId\`) REFERENCES \`armor_instance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_attribute\` ADD CONSTRAINT \`FK_592de01cdfda6a980a7bbd67848\` FOREIGN KEY (\`attributeId\`) REFERENCES \`armor_attribute\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_attribute\` ADD CONSTRAINT \`FK_420c5ebe6919eb0d20b4745c939\` FOREIGN KEY (\`damageTypeId\`) REFERENCES \`damage_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_damage_reduction\` ADD CONSTRAINT \`FK_4e8be9127052f64a93006758c9b\` FOREIGN KEY (\`armorId\`) REFERENCES \`armor_instance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_damage_reduction\` ADD CONSTRAINT \`FK_4bbdc7ca2637dec207efafad01e\` FOREIGN KEY (\`damageTypeId\`) REFERENCES \`damage_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_location\` ADD CONSTRAINT \`FK_9b56af5a233f83408a29eaf70a3\` FOREIGN KEY (\`locationId\`) REFERENCES \`equip_location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance\` ADD CONSTRAINT \`FK_56061822043f997dafdc8a9630a\` FOREIGN KEY (\`armorClassId\`) REFERENCES \`armor_class\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance\` ADD CONSTRAINT \`FK_a60791940e17597199a38e84a8a\` FOREIGN KEY (\`locationId\`) REFERENCES \`armor_location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance\` ADD CONSTRAINT \`FK_3ae045586ceb4467a31ba53b4d5\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`gem\` ADD CONSTRAINT \`FK_da3c10c31af9c5d3660e7c9921e\` FOREIGN KEY (\`rarityId\`) REFERENCES \`gem_rarity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`gem\` ADD CONSTRAINT \`FK_9fe3aa4b51a77e70bbbb03c03e9\` FOREIGN KEY (\`categoryId\`) REFERENCES \`item_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance_attribute\` ADD CONSTRAINT \`FK_36bbc58501c0d06d2d40b1b39ea\` FOREIGN KEY (\`jewelryId\`) REFERENCES \`jewelry_instance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance_attribute\` ADD CONSTRAINT \`FK_0d5a45ddc7a34c9c18fbe94e772\` FOREIGN KEY (\`attributeId\`) REFERENCES \`jewelry_attribute\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance_attribute\` ADD CONSTRAINT \`FK_f380f40bc89f06e782399dd3bc6\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_location\` ADD CONSTRAINT \`FK_f570ea965a5b794403750333159\` FOREIGN KEY (\`locationId\`) REFERENCES \`equip_location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance\` ADD CONSTRAINT \`FK_b280d9f0e960be77cb9da7de77d\` FOREIGN KEY (\`gemId\`) REFERENCES \`gem\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance\` ADD CONSTRAINT \`FK_ef6faac8de772d1c06ea3c3e71a\` FOREIGN KEY (\`locationId\`) REFERENCES \`jewelry_location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance\` ADD CONSTRAINT \`FK_d6ca35d4cc2b86a03884e678da9\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` ADD CONSTRAINT \`FK_adf09896259e997f27f16f2e915\` FOREIGN KEY (\`attributeId\`) REFERENCES \`spellbook_attribute\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` ADD CONSTRAINT \`FK_37761fd630309458cb283115e3c\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` ADD CONSTRAINT \`FK_03e96f4108be5187f064e078ec4\` FOREIGN KEY (\`slayerId\`) REFERENCES \`slayer_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` ADD CONSTRAINT \`FK_e3388e3c797c67bb2c4d790da7f\` FOREIGN KEY (\`spellbookId\`) REFERENCES \`spellbook_instance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance\` ADD CONSTRAINT \`FK_65c44a0870a0a928e8c0d0777ca\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`material\` ADD CONSTRAINT \`FK_660dc44876c3ca4028c1d3cb09c\` FOREIGN KEY (\`baseMaterialId\`) REFERENCES \`material_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_attribute\` ADD CONSTRAINT \`FK_8692005a61ac760793a1f48a74e\` FOREIGN KEY (\`skillId\`) REFERENCES \`weapon_skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance_attribute\` ADD CONSTRAINT \`FK_4b97b438fbe154834ce77980a1c\` FOREIGN KEY (\`weaponId\`) REFERENCES \`weapon_instance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance_attribute\` ADD CONSTRAINT \`FK_a0cb161f84e0e9b678488137361\` FOREIGN KEY (\`attributeId\`) REFERENCES \`weapon_attribute\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance_attribute\` ADD CONSTRAINT \`FK_a6d2ed8bfb085361d05ef3c7418\` FOREIGN KEY (\`slayerId\`) REFERENCES \`slayer_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon\` ADD CONSTRAINT \`FK_8be5bdcfeb89e0312f103961b82\` FOREIGN KEY (\`skillId\`) REFERENCES \`weapon_skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon\` ADD CONSTRAINT \`FK_2a44d0c5e0cd7a10ada2cd92d5a\` FOREIGN KEY (\`primaryMoveId\`) REFERENCES \`special_move\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon\` ADD CONSTRAINT \`FK_7e5f0c345a7e0ffeb4b017da179\` FOREIGN KEY (\`secondaryMoveId\`) REFERENCES \`special_move\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon\` ADD CONSTRAINT \`FK_37827972cb873b58757034e4cb8\` FOREIGN KEY (\`materialId\`) REFERENCES \`material_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance\` ADD CONSTRAINT \`FK_2bd4a3ac129497152ed4f0f0477\` FOREIGN KEY (\`weaponId\`) REFERENCES \`weapon\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance\` ADD CONSTRAINT \`FK_18a2f0d22cbd590d163720c0c9d\` FOREIGN KEY (\`materialId\`) REFERENCES \`material\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance\` ADD CONSTRAINT \`FK_c38c7860129c74aa09486d2b5ec\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_instance\` ADD CONSTRAINT \`FK_53df880160c0d0d836cb41ec8af\` FOREIGN KEY (\`battleAsEnemyId\`) REFERENCES \`battle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_instance\` ADD CONSTRAINT \`FK_31dddd05e9b71ae815cb17c3be1\` FOREIGN KEY (\`battleAsFriendlyId\`) REFERENCES \`battle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_instance\` ADD CONSTRAINT \`FK_5046593d4bafe954bfdcfa5d270\` FOREIGN KEY (\`ownerId\`) REFERENCES \`character\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_instance\` ADD CONSTRAINT \`FK_d7eb15c80296ded1de6630838f7\` FOREIGN KEY (\`monsterId\`) REFERENCES \`monster\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_instance\` ADD CONSTRAINT \`FK_b135cc5f67558d624613805f41c\` FOREIGN KEY (\`nextActionId\`) REFERENCES \`monster_action\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_instance\` ADD CONSTRAINT \`FK_2314eab436f3d09b5a7da01cba1\` FOREIGN KEY (\`actionDamageTypeId\`) REFERENCES \`damage_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_instance\` ADD CONSTRAINT \`FK_4ca8daa3cbd0d30203c14e45ae7\` FOREIGN KEY (\`lootId\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character_condition\` ADD CONSTRAINT \`FK_e6fe7ed05b8b3c2470cb79306e1\` FOREIGN KEY (\`conditionId\`) REFERENCES \`condition\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character_condition\` ADD CONSTRAINT \`FK_bf4ac274a380f50555cd37e3e41\` FOREIGN KEY (\`targetId\`) REFERENCES \`monster_instance\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character_condition\` ADD CONSTRAINT \`FK_3d1e2cd15440b6eabe9df89c891\` FOREIGN KEY (\`characterId\`) REFERENCES \`character\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`race_skill\` ADD CONSTRAINT \`FK_ef48966f9cfe3b60e02650dab48\` FOREIGN KEY (\`raceId\`) REFERENCES \`race\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`race_skill\` ADD CONSTRAINT \`FK_f1cee220a1c2d5975345de0ba8f\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character_skill\` ADD CONSTRAINT \`FK_39dcbdc540ee9ff68c7e39bcbe4\` FOREIGN KEY (\`characterId\`) REFERENCES \`character\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character_skill\` ADD CONSTRAINT \`FK_e12377dbce6154a7bcb2db70cbc\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character\` ADD CONSTRAINT \`FK_a7485d062b19695002b6175e8fb\` FOREIGN KEY (\`raceId\`) REFERENCES \`race\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character\` ADD CONSTRAINT \`FK_deaa8cb01bd0a343e8b649d32ce\` FOREIGN KEY (\`gameId\`) REFERENCES \`game\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character\` ADD CONSTRAINT \`FK_5b277d0c9baa952e5c9a95e59a5\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`character\` ADD CONSTRAINT \`FK_13fba937ad130d9285e0f286869\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`battle\` ADD CONSTRAINT \`FK_dd8df503fb950a185819b9a07c7\` FOREIGN KEY (\`gameId\`) REFERENCES \`game\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`battle\` ADD CONSTRAINT \`FK_9ef6fcbc7ceb864da3bb731e587\` FOREIGN KEY (\`initiatorId\`) REFERENCES \`character\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`player_games_game\` ADD CONSTRAINT \`FK_2718b3b614632ea1ce019e8ec1c\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`player_games_game\` ADD CONSTRAINT \`FK_70cf03c195b3ff8652320e40a95\` FOREIGN KEY (\`gameId\`) REFERENCES \`game\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_slayers_slayer_type\` ADD CONSTRAINT \`FK_2e2e6923869b90fd6c65558c15e\` FOREIGN KEY (\`monsterId\`) REFERENCES \`monster\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_slayers_slayer_type\` ADD CONSTRAINT \`FK_bbd834561b870c6049e80b7e2b4\` FOREIGN KEY (\`slayerTypeId\`) REFERENCES \`slayer_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`condition_overrides_condition\` ADD CONSTRAINT \`FK_b74b22dfc4b885ca55f5914d36e\` FOREIGN KEY (\`conditionId_1\`) REFERENCES \`condition\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`condition_overrides_condition\` ADD CONSTRAINT \`FK_6a083e2fd9df823e15686f30044\` FOREIGN KEY (\`conditionId_2\`) REFERENCES \`condition\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`battle_participants_character\` ADD CONSTRAINT \`FK_10e745f65df54dea13dd5be7546\` FOREIGN KEY (\`battleId\`) REFERENCES \`battle\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`battle_participants_character\` ADD CONSTRAINT \`FK_a4688b0786211e3b51c5d01b6dd\` FOREIGN KEY (\`characterId\`) REFERENCES \`character\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`battle_participants_character\` DROP FOREIGN KEY \`FK_a4688b0786211e3b51c5d01b6dd\``
    )
    await queryRunner.query(
      `ALTER TABLE \`battle_participants_character\` DROP FOREIGN KEY \`FK_10e745f65df54dea13dd5be7546\``
    )
    await queryRunner.query(
      `ALTER TABLE \`condition_overrides_condition\` DROP FOREIGN KEY \`FK_6a083e2fd9df823e15686f30044\``
    )
    await queryRunner.query(
      `ALTER TABLE \`condition_overrides_condition\` DROP FOREIGN KEY \`FK_b74b22dfc4b885ca55f5914d36e\``
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_slayers_slayer_type\` DROP FOREIGN KEY \`FK_bbd834561b870c6049e80b7e2b4\``
    )
    await queryRunner.query(
      `ALTER TABLE \`monster_slayers_slayer_type\` DROP FOREIGN KEY \`FK_2e2e6923869b90fd6c65558c15e\``
    )
    await queryRunner.query(`ALTER TABLE \`player_games_game\` DROP FOREIGN KEY \`FK_70cf03c195b3ff8652320e40a95\``)
    await queryRunner.query(`ALTER TABLE \`player_games_game\` DROP FOREIGN KEY \`FK_2718b3b614632ea1ce019e8ec1c\``)
    await queryRunner.query(`ALTER TABLE \`battle\` DROP FOREIGN KEY \`FK_9ef6fcbc7ceb864da3bb731e587\``)
    await queryRunner.query(`ALTER TABLE \`battle\` DROP FOREIGN KEY \`FK_dd8df503fb950a185819b9a07c7\``)
    await queryRunner.query(`ALTER TABLE \`character\` DROP FOREIGN KEY \`FK_13fba937ad130d9285e0f286869\``)
    await queryRunner.query(`ALTER TABLE \`character\` DROP FOREIGN KEY \`FK_5b277d0c9baa952e5c9a95e59a5\``)
    await queryRunner.query(`ALTER TABLE \`character\` DROP FOREIGN KEY \`FK_deaa8cb01bd0a343e8b649d32ce\``)
    await queryRunner.query(`ALTER TABLE \`character\` DROP FOREIGN KEY \`FK_a7485d062b19695002b6175e8fb\``)
    await queryRunner.query(`ALTER TABLE \`character_skill\` DROP FOREIGN KEY \`FK_e12377dbce6154a7bcb2db70cbc\``)
    await queryRunner.query(`ALTER TABLE \`character_skill\` DROP FOREIGN KEY \`FK_39dcbdc540ee9ff68c7e39bcbe4\``)
    await queryRunner.query(`ALTER TABLE \`race_skill\` DROP FOREIGN KEY \`FK_f1cee220a1c2d5975345de0ba8f\``)
    await queryRunner.query(`ALTER TABLE \`race_skill\` DROP FOREIGN KEY \`FK_ef48966f9cfe3b60e02650dab48\``)
    await queryRunner.query(`ALTER TABLE \`character_condition\` DROP FOREIGN KEY \`FK_3d1e2cd15440b6eabe9df89c891\``)
    await queryRunner.query(`ALTER TABLE \`character_condition\` DROP FOREIGN KEY \`FK_bf4ac274a380f50555cd37e3e41\``)
    await queryRunner.query(`ALTER TABLE \`character_condition\` DROP FOREIGN KEY \`FK_e6fe7ed05b8b3c2470cb79306e1\``)
    await queryRunner.query(`ALTER TABLE \`monster_instance\` DROP FOREIGN KEY \`FK_4ca8daa3cbd0d30203c14e45ae7\``)
    await queryRunner.query(`ALTER TABLE \`monster_instance\` DROP FOREIGN KEY \`FK_2314eab436f3d09b5a7da01cba1\``)
    await queryRunner.query(`ALTER TABLE \`monster_instance\` DROP FOREIGN KEY \`FK_b135cc5f67558d624613805f41c\``)
    await queryRunner.query(`ALTER TABLE \`monster_instance\` DROP FOREIGN KEY \`FK_d7eb15c80296ded1de6630838f7\``)
    await queryRunner.query(`ALTER TABLE \`monster_instance\` DROP FOREIGN KEY \`FK_5046593d4bafe954bfdcfa5d270\``)
    await queryRunner.query(`ALTER TABLE \`monster_instance\` DROP FOREIGN KEY \`FK_31dddd05e9b71ae815cb17c3be1\``)
    await queryRunner.query(`ALTER TABLE \`monster_instance\` DROP FOREIGN KEY \`FK_53df880160c0d0d836cb41ec8af\``)
    await queryRunner.query(`ALTER TABLE \`weapon_instance\` DROP FOREIGN KEY \`FK_c38c7860129c74aa09486d2b5ec\``)
    await queryRunner.query(`ALTER TABLE \`weapon_instance\` DROP FOREIGN KEY \`FK_18a2f0d22cbd590d163720c0c9d\``)
    await queryRunner.query(`ALTER TABLE \`weapon_instance\` DROP FOREIGN KEY \`FK_2bd4a3ac129497152ed4f0f0477\``)
    await queryRunner.query(`ALTER TABLE \`weapon\` DROP FOREIGN KEY \`FK_37827972cb873b58757034e4cb8\``)
    await queryRunner.query(`ALTER TABLE \`weapon\` DROP FOREIGN KEY \`FK_7e5f0c345a7e0ffeb4b017da179\``)
    await queryRunner.query(`ALTER TABLE \`weapon\` DROP FOREIGN KEY \`FK_2a44d0c5e0cd7a10ada2cd92d5a\``)
    await queryRunner.query(`ALTER TABLE \`weapon\` DROP FOREIGN KEY \`FK_8be5bdcfeb89e0312f103961b82\``)
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance_attribute\` DROP FOREIGN KEY \`FK_a6d2ed8bfb085361d05ef3c7418\``
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance_attribute\` DROP FOREIGN KEY \`FK_a0cb161f84e0e9b678488137361\``
    )
    await queryRunner.query(
      `ALTER TABLE \`weapon_instance_attribute\` DROP FOREIGN KEY \`FK_4b97b438fbe154834ce77980a1c\``
    )
    await queryRunner.query(`ALTER TABLE \`weapon_attribute\` DROP FOREIGN KEY \`FK_8692005a61ac760793a1f48a74e\``)
    await queryRunner.query(`ALTER TABLE \`material\` DROP FOREIGN KEY \`FK_660dc44876c3ca4028c1d3cb09c\``)
    await queryRunner.query(`ALTER TABLE \`spellbook_instance\` DROP FOREIGN KEY \`FK_65c44a0870a0a928e8c0d0777ca\``)
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` DROP FOREIGN KEY \`FK_e3388e3c797c67bb2c4d790da7f\``
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` DROP FOREIGN KEY \`FK_03e96f4108be5187f064e078ec4\``
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` DROP FOREIGN KEY \`FK_37761fd630309458cb283115e3c\``
    )
    await queryRunner.query(
      `ALTER TABLE \`spellbook_instance_attribute\` DROP FOREIGN KEY \`FK_adf09896259e997f27f16f2e915\``
    )
    await queryRunner.query(`ALTER TABLE \`jewelry_instance\` DROP FOREIGN KEY \`FK_d6ca35d4cc2b86a03884e678da9\``)
    await queryRunner.query(`ALTER TABLE \`jewelry_instance\` DROP FOREIGN KEY \`FK_ef6faac8de772d1c06ea3c3e71a\``)
    await queryRunner.query(`ALTER TABLE \`jewelry_instance\` DROP FOREIGN KEY \`FK_b280d9f0e960be77cb9da7de77d\``)
    await queryRunner.query(`ALTER TABLE \`jewelry_location\` DROP FOREIGN KEY \`FK_f570ea965a5b794403750333159\``)
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance_attribute\` DROP FOREIGN KEY \`FK_f380f40bc89f06e782399dd3bc6\``
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance_attribute\` DROP FOREIGN KEY \`FK_0d5a45ddc7a34c9c18fbe94e772\``
    )
    await queryRunner.query(
      `ALTER TABLE \`jewelry_instance_attribute\` DROP FOREIGN KEY \`FK_36bbc58501c0d06d2d40b1b39ea\``
    )
    await queryRunner.query(`ALTER TABLE \`gem\` DROP FOREIGN KEY \`FK_9fe3aa4b51a77e70bbbb03c03e9\``)
    await queryRunner.query(`ALTER TABLE \`gem\` DROP FOREIGN KEY \`FK_da3c10c31af9c5d3660e7c9921e\``)
    await queryRunner.query(`ALTER TABLE \`armor_instance\` DROP FOREIGN KEY \`FK_3ae045586ceb4467a31ba53b4d5\``)
    await queryRunner.query(`ALTER TABLE \`armor_instance\` DROP FOREIGN KEY \`FK_a60791940e17597199a38e84a8a\``)
    await queryRunner.query(`ALTER TABLE \`armor_instance\` DROP FOREIGN KEY \`FK_56061822043f997dafdc8a9630a\``)
    await queryRunner.query(`ALTER TABLE \`armor_location\` DROP FOREIGN KEY \`FK_9b56af5a233f83408a29eaf70a3\``)
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_damage_reduction\` DROP FOREIGN KEY \`FK_4bbdc7ca2637dec207efafad01e\``
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_damage_reduction\` DROP FOREIGN KEY \`FK_4e8be9127052f64a93006758c9b\``
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_attribute\` DROP FOREIGN KEY \`FK_420c5ebe6919eb0d20b4745c939\``
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_attribute\` DROP FOREIGN KEY \`FK_592de01cdfda6a980a7bbd67848\``
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_instance_attribute\` DROP FOREIGN KEY \`FK_a48388ff1e07be7af2710db00f4\``
    )
    await queryRunner.query(`ALTER TABLE \`armor_class\` DROP FOREIGN KEY \`FK_c89160171695ce4026c827fac88\``)
    await queryRunner.query(
      `ALTER TABLE \`armor_class_damage_reduction\` DROP FOREIGN KEY \`FK_55187e994e82f93943f254b1307\``
    )
    await queryRunner.query(
      `ALTER TABLE \`armor_class_damage_reduction\` DROP FOREIGN KEY \`FK_487d2a8f99c619b4535d2ec023b\``
    )
    await queryRunner.query(`ALTER TABLE \`monster_condition\` DROP FOREIGN KEY \`FK_4a316650c8248dd45d4a1e6000b\``)
    await queryRunner.query(`ALTER TABLE \`monster_condition\` DROP FOREIGN KEY \`FK_dc225a588847769fdc99bc5f51f\``)
    await queryRunner.query(`ALTER TABLE \`monster_condition\` DROP FOREIGN KEY \`FK_e7a29847a1751a1467d24434f3d\``)
    await queryRunner.query(`ALTER TABLE \`condition\` DROP FOREIGN KEY \`FK_a9a00b82a00b60a38dde793c3cf\``)
    await queryRunner.query(`ALTER TABLE \`monster\` DROP FOREIGN KEY \`FK_10fa8ba1b89415844585423dea3\``)
    await queryRunner.query(`ALTER TABLE \`monster\` DROP FOREIGN KEY \`FK_572eb283f5e63eb6350aa93e0b8\``)
    await queryRunner.query(`ALTER TABLE \`monster_action\` DROP FOREIGN KEY \`FK_66e50e885cfcf9bf9155e561c94\``)
    await queryRunner.query(`ALTER TABLE \`monster_action\` DROP FOREIGN KEY \`FK_b8aad316d39b87ceb1065028cfd\``)
    await queryRunner.query(`ALTER TABLE \`player\` DROP FOREIGN KEY \`FK_a685e5d5fc1676a8bcd05e681cc\``)
    await queryRunner.query(`ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_d05575b5a28ec6dad65c2aef301\``)
    await queryRunner.query(`DROP INDEX \`IDX_a4688b0786211e3b51c5d01b6d\` ON \`battle_participants_character\``)
    await queryRunner.query(`DROP INDEX \`IDX_10e745f65df54dea13dd5be754\` ON \`battle_participants_character\``)
    await queryRunner.query(`DROP TABLE \`battle_participants_character\``)
    await queryRunner.query(`DROP INDEX \`IDX_6a083e2fd9df823e15686f3004\` ON \`condition_overrides_condition\``)
    await queryRunner.query(`DROP INDEX \`IDX_b74b22dfc4b885ca55f5914d36\` ON \`condition_overrides_condition\``)
    await queryRunner.query(`DROP TABLE \`condition_overrides_condition\``)
    await queryRunner.query(`DROP INDEX \`IDX_bbd834561b870c6049e80b7e2b\` ON \`monster_slayers_slayer_type\``)
    await queryRunner.query(`DROP INDEX \`IDX_2e2e6923869b90fd6c65558c15\` ON \`monster_slayers_slayer_type\``)
    await queryRunner.query(`DROP TABLE \`monster_slayers_slayer_type\``)
    await queryRunner.query(`DROP INDEX \`IDX_70cf03c195b3ff8652320e40a9\` ON \`player_games_game\``)
    await queryRunner.query(`DROP INDEX \`IDX_2718b3b614632ea1ce019e8ec1\` ON \`player_games_game\``)
    await queryRunner.query(`DROP TABLE \`player_games_game\``)
    await queryRunner.query(`DROP TABLE \`battle\``)
    await queryRunner.query(`DROP INDEX \`REL_13fba937ad130d9285e0f28686\` ON \`character\``)
    await queryRunner.query(`DROP TABLE \`character\``)
    await queryRunner.query(`DROP TABLE \`character_skill\``)
    await queryRunner.query(`DROP TABLE \`race\``)
    await queryRunner.query(`DROP TABLE \`race_skill\``)
    await queryRunner.query(`DROP TABLE \`character_condition\``)
    await queryRunner.query(`DROP INDEX \`REL_4ca8daa3cbd0d30203c14e45ae\` ON \`monster_instance\``)
    await queryRunner.query(`DROP TABLE \`monster_instance\``)
    await queryRunner.query(`DROP TABLE \`inventory\``)
    await queryRunner.query(`DROP TABLE \`weapon_instance\``)
    await queryRunner.query(`DROP TABLE \`weapon\``)
    await queryRunner.query(`DROP TABLE \`special_move\``)
    await queryRunner.query(`DROP TABLE \`weapon_instance_attribute\``)
    await queryRunner.query(`DROP TABLE \`weapon_attribute\``)
    await queryRunner.query(`DROP TABLE \`weapon_skill\``)
    await queryRunner.query(`DROP TABLE \`material\``)
    await queryRunner.query(`DROP TABLE \`material_type\``)
    await queryRunner.query(`DROP TABLE \`spellbook_instance\``)
    await queryRunner.query(`DROP TABLE \`spellbook_instance_attribute\``)
    await queryRunner.query(`DROP TABLE \`spellbook_attribute\``)
    await queryRunner.query(`DROP TABLE \`jewelry_instance\``)
    await queryRunner.query(`DROP TABLE \`jewelry_location\``)
    await queryRunner.query(`DROP TABLE \`jewelry_instance_attribute\``)
    await queryRunner.query(`DROP TABLE \`jewelry_attribute\``)
    await queryRunner.query(`DROP TABLE \`skill\``)
    await queryRunner.query(`DROP TABLE \`gem\``)
    await queryRunner.query(`DROP TABLE \`item_category\``)
    await queryRunner.query(`DROP TABLE \`gem_rarity\``)
    await queryRunner.query(`DROP TABLE \`armor_instance\``)
    await queryRunner.query(`DROP INDEX \`REL_9b56af5a233f83408a29eaf70a\` ON \`armor_location\``)
    await queryRunner.query(`DROP TABLE \`armor_location\``)
    await queryRunner.query(`DROP TABLE \`equip_location\``)
    await queryRunner.query(`DROP TABLE \`armor_instance_damage_reduction\``)
    await queryRunner.query(`DROP TABLE \`armor_instance_attribute\``)
    await queryRunner.query(`DROP TABLE \`armor_attribute\``)
    await queryRunner.query(`DROP TABLE \`armor_class\``)
    await queryRunner.query(`DROP TABLE \`armor_class_damage_reduction\``)
    await queryRunner.query(`DROP TABLE \`monster_condition\``)
    await queryRunner.query(`DROP TABLE \`condition\``)
    await queryRunner.query(`DROP TABLE \`monster\``)
    await queryRunner.query(`DROP TABLE \`slayer_type\``)
    await queryRunner.query(`DROP TABLE \`monster_action\``)
    await queryRunner.query(`DROP TABLE \`action\``)
    await queryRunner.query(`DROP TABLE \`damage_type\``)
    await queryRunner.query(`DROP INDEX \`IDX_19b3d69e0f058936531e3965b7\` ON \`player\``)
    await queryRunner.query(`DROP INDEX \`IDX_331aaf0d7a5a45f9c74cc699ea\` ON \`player\``)
    await queryRunner.query(`DROP TABLE \`player\``)
    await queryRunner.query(`DROP INDEX \`IDX_5d1e08e04b97aa06d671cd5840\` ON \`game\``)
    await queryRunner.query(`DROP TABLE \`game\``)
  }
}
