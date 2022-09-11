import { MigrationInterface, QueryRunner } from "typeorm";

export class jewelry1662902602675 implements MigrationInterface {
    name = 'jewelry1662902602675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gem_rarity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "durability" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "item_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "gem" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "weight" integer NOT NULL, "image" varchar NOT NULL, "level" integer NOT NULL, "rarityId" integer, "categoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "jewelry_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "value" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "jewelry_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "jewelryId" integer, "attributeId" integer NOT NULL, "skillId" integer)`);
        await queryRunner.query(`CREATE TABLE "jewelry_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "locationId" integer)`);
        await queryRunner.query(`CREATE TABLE "jewelry_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "equipped" boolean NOT NULL, "damaged" boolean NOT NULL, "gemId" integer NOT NULL, "locationId" integer NOT NULL, "inventoryId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_gem" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "weight" integer NOT NULL, "image" varchar NOT NULL, "level" integer NOT NULL, "rarityId" integer, "categoryId" integer, CONSTRAINT "FK_da3c10c31af9c5d3660e7c9921e" FOREIGN KEY ("rarityId") REFERENCES "gem_rarity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_9fe3aa4b51a77e70bbbb03c03e9" FOREIGN KEY ("categoryId") REFERENCES "item_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_gem"("id", "createdAt", "updatedAt", "name", "weight", "image", "level", "rarityId", "categoryId") SELECT "id", "createdAt", "updatedAt", "name", "weight", "image", "level", "rarityId", "categoryId" FROM "gem"`);
        await queryRunner.query(`DROP TABLE "gem"`);
        await queryRunner.query(`ALTER TABLE "temporary_gem" RENAME TO "gem"`);
        await queryRunner.query(`CREATE TABLE "temporary_jewelry_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "jewelryId" integer, "attributeId" integer NOT NULL, "skillId" integer, CONSTRAINT "FK_36bbc58501c0d06d2d40b1b39ea" FOREIGN KEY ("jewelryId") REFERENCES "jewelry_instance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0d5a45ddc7a34c9c18fbe94e772" FOREIGN KEY ("attributeId") REFERENCES "jewelry_attribute" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f380f40bc89f06e782399dd3bc6" FOREIGN KEY ("skillId") REFERENCES "skill" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_jewelry_instance_attribute"("id", "createdAt", "updatedAt", "value", "jewelryId", "attributeId", "skillId") SELECT "id", "createdAt", "updatedAt", "value", "jewelryId", "attributeId", "skillId" FROM "jewelry_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "jewelry_instance_attribute"`);
        await queryRunner.query(`ALTER TABLE "temporary_jewelry_instance_attribute" RENAME TO "jewelry_instance_attribute"`);
        await queryRunner.query(`CREATE TABLE "temporary_jewelry_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "locationId" integer, CONSTRAINT "FK_f570ea965a5b794403750333159" FOREIGN KEY ("locationId") REFERENCES "equip_location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_jewelry_location"("id", "createdAt", "updatedAt", "name", "locationId") SELECT "id", "createdAt", "updatedAt", "name", "locationId" FROM "jewelry_location"`);
        await queryRunner.query(`DROP TABLE "jewelry_location"`);
        await queryRunner.query(`ALTER TABLE "temporary_jewelry_location" RENAME TO "jewelry_location"`);
        await queryRunner.query(`CREATE TABLE "temporary_jewelry_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "equipped" boolean NOT NULL, "damaged" boolean NOT NULL, "gemId" integer NOT NULL, "locationId" integer NOT NULL, "inventoryId" integer NOT NULL, CONSTRAINT "FK_b280d9f0e960be77cb9da7de77d" FOREIGN KEY ("gemId") REFERENCES "gem" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ef6faac8de772d1c06ea3c3e71a" FOREIGN KEY ("locationId") REFERENCES "jewelry_location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d6ca35d4cc2b86a03884e678da9" FOREIGN KEY ("inventoryId") REFERENCES "inventory" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_jewelry_instance"("id", "createdAt", "updatedAt", "equipped", "damaged", "gemId", "locationId", "inventoryId") SELECT "id", "createdAt", "updatedAt", "equipped", "damaged", "gemId", "locationId", "inventoryId" FROM "jewelry_instance"`);
        await queryRunner.query(`DROP TABLE "jewelry_instance"`);
        await queryRunner.query(`ALTER TABLE "temporary_jewelry_instance" RENAME TO "jewelry_instance"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jewelry_instance" RENAME TO "temporary_jewelry_instance"`);
        await queryRunner.query(`CREATE TABLE "jewelry_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "equipped" boolean NOT NULL, "damaged" boolean NOT NULL, "gemId" integer NOT NULL, "locationId" integer NOT NULL, "inventoryId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "jewelry_instance"("id", "createdAt", "updatedAt", "equipped", "damaged", "gemId", "locationId", "inventoryId") SELECT "id", "createdAt", "updatedAt", "equipped", "damaged", "gemId", "locationId", "inventoryId" FROM "temporary_jewelry_instance"`);
        await queryRunner.query(`DROP TABLE "temporary_jewelry_instance"`);
        await queryRunner.query(`ALTER TABLE "jewelry_location" RENAME TO "temporary_jewelry_location"`);
        await queryRunner.query(`CREATE TABLE "jewelry_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "locationId" integer)`);
        await queryRunner.query(`INSERT INTO "jewelry_location"("id", "createdAt", "updatedAt", "name", "locationId") SELECT "id", "createdAt", "updatedAt", "name", "locationId" FROM "temporary_jewelry_location"`);
        await queryRunner.query(`DROP TABLE "temporary_jewelry_location"`);
        await queryRunner.query(`ALTER TABLE "jewelry_instance_attribute" RENAME TO "temporary_jewelry_instance_attribute"`);
        await queryRunner.query(`CREATE TABLE "jewelry_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "jewelryId" integer, "attributeId" integer NOT NULL, "skillId" integer)`);
        await queryRunner.query(`INSERT INTO "jewelry_instance_attribute"("id", "createdAt", "updatedAt", "value", "jewelryId", "attributeId", "skillId") SELECT "id", "createdAt", "updatedAt", "value", "jewelryId", "attributeId", "skillId" FROM "temporary_jewelry_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "temporary_jewelry_instance_attribute"`);
        await queryRunner.query(`ALTER TABLE "gem" RENAME TO "temporary_gem"`);
        await queryRunner.query(`CREATE TABLE "gem" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "weight" integer NOT NULL, "image" varchar NOT NULL, "level" integer NOT NULL, "rarityId" integer, "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "gem"("id", "createdAt", "updatedAt", "name", "weight", "image", "level", "rarityId", "categoryId") SELECT "id", "createdAt", "updatedAt", "name", "weight", "image", "level", "rarityId", "categoryId" FROM "temporary_gem"`);
        await queryRunner.query(`DROP TABLE "temporary_gem"`);
        await queryRunner.query(`DROP TABLE "jewelry_instance"`);
        await queryRunner.query(`DROP TABLE "jewelry_location"`);
        await queryRunner.query(`DROP TABLE "jewelry_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "jewelry_attribute"`);
        await queryRunner.query(`DROP TABLE "gem"`);
        await queryRunner.query(`DROP TABLE "item_category"`);
        await queryRunner.query(`DROP TABLE "gem_rarity"`);
    }

}
