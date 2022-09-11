import { MigrationInterface, QueryRunner } from "typeorm";

export class inventoryArmor1662864007122 implements MigrationInterface {
    name = 'inventoryArmor1662864007122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "armor_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "value" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "armor_class" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "durability" integer NOT NULL, "reductionsId" integer)`);
        await queryRunner.query(`CREATE TABLE "armor_class_damage_reduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "level" integer NOT NULL, "reduction" varchar NOT NULL, "armorClassId" integer, "damageTypeId" integer)`);
        await queryRunner.query(`CREATE TABLE "armor_instance_damage_reduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "value" integer NOT NULL, "armorId" integer, "damageTypeId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "equip_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "armor_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "locationId" integer, CONSTRAINT "REL_9b56af5a233f83408a29eaf70a" UNIQUE ("locationId"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "limit" boolean NOT NULL DEFAULT (0), "gold" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "armor_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "equipped" boolean NOT NULL, "damaged" boolean NOT NULL, "armorClassId" integer NOT NULL, "locationId" integer NOT NULL, "inventoryId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "armor_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "armorId" integer, "attributeId" integer NOT NULL, "damageTypeId" integer)`);
        await queryRunner.query(`CREATE TABLE "armor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_armor_class" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "durability" integer NOT NULL, "reductionsId" integer, CONSTRAINT "FK_c89160171695ce4026c827fac88" FOREIGN KEY ("reductionsId") REFERENCES "armor_class_damage_reduction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_armor_class"("id", "createdAt", "updatedAt", "name", "durability", "reductionsId") SELECT "id", "createdAt", "updatedAt", "name", "durability", "reductionsId" FROM "armor_class"`);
        await queryRunner.query(`DROP TABLE "armor_class"`);
        await queryRunner.query(`ALTER TABLE "temporary_armor_class" RENAME TO "armor_class"`);
        await queryRunner.query(`CREATE TABLE "temporary_armor_class_damage_reduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "level" integer NOT NULL, "reduction" varchar NOT NULL, "armorClassId" integer, "damageTypeId" integer, CONSTRAINT "FK_487d2a8f99c619b4535d2ec023b" FOREIGN KEY ("armorClassId") REFERENCES "armor_class" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_55187e994e82f93943f254b1307" FOREIGN KEY ("damageTypeId") REFERENCES "damage_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_armor_class_damage_reduction"("id", "createdAt", "updatedAt", "level", "reduction", "armorClassId", "damageTypeId") SELECT "id", "createdAt", "updatedAt", "level", "reduction", "armorClassId", "damageTypeId" FROM "armor_class_damage_reduction"`);
        await queryRunner.query(`DROP TABLE "armor_class_damage_reduction"`);
        await queryRunner.query(`ALTER TABLE "temporary_armor_class_damage_reduction" RENAME TO "armor_class_damage_reduction"`);
        await queryRunner.query(`CREATE TABLE "temporary_armor_instance_damage_reduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "value" integer NOT NULL, "armorId" integer, "damageTypeId" integer NOT NULL, CONSTRAINT "FK_4e8be9127052f64a93006758c9b" FOREIGN KEY ("armorId") REFERENCES "armor_instance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4bbdc7ca2637dec207efafad01e" FOREIGN KEY ("damageTypeId") REFERENCES "damage_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_armor_instance_damage_reduction"("id", "createdAt", "updatedAt", "name", "value", "armorId", "damageTypeId") SELECT "id", "createdAt", "updatedAt", "name", "value", "armorId", "damageTypeId" FROM "armor_instance_damage_reduction"`);
        await queryRunner.query(`DROP TABLE "armor_instance_damage_reduction"`);
        await queryRunner.query(`ALTER TABLE "temporary_armor_instance_damage_reduction" RENAME TO "armor_instance_damage_reduction"`);
        await queryRunner.query(`CREATE TABLE "temporary_armor_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "locationId" integer, CONSTRAINT "REL_9b56af5a233f83408a29eaf70a" UNIQUE ("locationId"), CONSTRAINT "FK_9b56af5a233f83408a29eaf70a3" FOREIGN KEY ("locationId") REFERENCES "equip_location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_armor_location"("id", "createdAt", "updatedAt", "name", "locationId") SELECT "id", "createdAt", "updatedAt", "name", "locationId" FROM "armor_location"`);
        await queryRunner.query(`DROP TABLE "armor_location"`);
        await queryRunner.query(`ALTER TABLE "temporary_armor_location" RENAME TO "armor_location"`);
        await queryRunner.query(`CREATE TABLE "temporary_armor_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "equipped" boolean NOT NULL, "damaged" boolean NOT NULL, "armorClassId" integer NOT NULL, "locationId" integer NOT NULL, "inventoryId" integer NOT NULL, CONSTRAINT "FK_56061822043f997dafdc8a9630a" FOREIGN KEY ("armorClassId") REFERENCES "armor_class" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a60791940e17597199a38e84a8a" FOREIGN KEY ("locationId") REFERENCES "armor_location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3ae045586ceb4467a31ba53b4d5" FOREIGN KEY ("inventoryId") REFERENCES "inventory" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_armor_instance"("id", "createdAt", "updatedAt", "equipped", "damaged", "armorClassId", "locationId", "inventoryId") SELECT "id", "createdAt", "updatedAt", "equipped", "damaged", "armorClassId", "locationId", "inventoryId" FROM "armor_instance"`);
        await queryRunner.query(`DROP TABLE "armor_instance"`);
        await queryRunner.query(`ALTER TABLE "temporary_armor_instance" RENAME TO "armor_instance"`);
        await queryRunner.query(`CREATE TABLE "temporary_armor_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "armorId" integer, "attributeId" integer NOT NULL, "damageTypeId" integer, CONSTRAINT "FK_a48388ff1e07be7af2710db00f4" FOREIGN KEY ("armorId") REFERENCES "armor_instance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_592de01cdfda6a980a7bbd67848" FOREIGN KEY ("attributeId") REFERENCES "armor_attribute" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_420c5ebe6919eb0d20b4745c939" FOREIGN KEY ("damageTypeId") REFERENCES "damage_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_armor_instance_attribute"("id", "createdAt", "updatedAt", "value", "armorId", "attributeId", "damageTypeId") SELECT "id", "createdAt", "updatedAt", "value", "armorId", "attributeId", "damageTypeId" FROM "armor_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "armor_instance_attribute"`);
        await queryRunner.query(`ALTER TABLE "temporary_armor_instance_attribute" RENAME TO "armor_instance_attribute"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "armor_instance_attribute" RENAME TO "temporary_armor_instance_attribute"`);
        await queryRunner.query(`CREATE TABLE "armor_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "armorId" integer, "attributeId" integer NOT NULL, "damageTypeId" integer)`);
        await queryRunner.query(`INSERT INTO "armor_instance_attribute"("id", "createdAt", "updatedAt", "value", "armorId", "attributeId", "damageTypeId") SELECT "id", "createdAt", "updatedAt", "value", "armorId", "attributeId", "damageTypeId" FROM "temporary_armor_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "temporary_armor_instance_attribute"`);
        await queryRunner.query(`ALTER TABLE "armor_instance" RENAME TO "temporary_armor_instance"`);
        await queryRunner.query(`CREATE TABLE "armor_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "equipped" boolean NOT NULL, "damaged" boolean NOT NULL, "armorClassId" integer NOT NULL, "locationId" integer NOT NULL, "inventoryId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "armor_instance"("id", "createdAt", "updatedAt", "equipped", "damaged", "armorClassId", "locationId", "inventoryId") SELECT "id", "createdAt", "updatedAt", "equipped", "damaged", "armorClassId", "locationId", "inventoryId" FROM "temporary_armor_instance"`);
        await queryRunner.query(`DROP TABLE "temporary_armor_instance"`);
        await queryRunner.query(`ALTER TABLE "armor_location" RENAME TO "temporary_armor_location"`);
        await queryRunner.query(`CREATE TABLE "armor_location" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "locationId" integer, CONSTRAINT "REL_9b56af5a233f83408a29eaf70a" UNIQUE ("locationId"))`);
        await queryRunner.query(`INSERT INTO "armor_location"("id", "createdAt", "updatedAt", "name", "locationId") SELECT "id", "createdAt", "updatedAt", "name", "locationId" FROM "temporary_armor_location"`);
        await queryRunner.query(`DROP TABLE "temporary_armor_location"`);
        await queryRunner.query(`ALTER TABLE "armor_instance_damage_reduction" RENAME TO "temporary_armor_instance_damage_reduction"`);
        await queryRunner.query(`CREATE TABLE "armor_instance_damage_reduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "value" integer NOT NULL, "armorId" integer, "damageTypeId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "armor_instance_damage_reduction"("id", "createdAt", "updatedAt", "name", "value", "armorId", "damageTypeId") SELECT "id", "createdAt", "updatedAt", "name", "value", "armorId", "damageTypeId" FROM "temporary_armor_instance_damage_reduction"`);
        await queryRunner.query(`DROP TABLE "temporary_armor_instance_damage_reduction"`);
        await queryRunner.query(`ALTER TABLE "armor_class_damage_reduction" RENAME TO "temporary_armor_class_damage_reduction"`);
        await queryRunner.query(`CREATE TABLE "armor_class_damage_reduction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "level" integer NOT NULL, "reduction" varchar NOT NULL, "armorClassId" integer, "damageTypeId" integer)`);
        await queryRunner.query(`INSERT INTO "armor_class_damage_reduction"("id", "createdAt", "updatedAt", "level", "reduction", "armorClassId", "damageTypeId") SELECT "id", "createdAt", "updatedAt", "level", "reduction", "armorClassId", "damageTypeId" FROM "temporary_armor_class_damage_reduction"`);
        await queryRunner.query(`DROP TABLE "temporary_armor_class_damage_reduction"`);
        await queryRunner.query(`ALTER TABLE "armor_class" RENAME TO "temporary_armor_class"`);
        await queryRunner.query(`CREATE TABLE "armor_class" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "durability" integer NOT NULL, "reductionsId" integer)`);
        await queryRunner.query(`INSERT INTO "armor_class"("id", "createdAt", "updatedAt", "name", "durability", "reductionsId") SELECT "id", "createdAt", "updatedAt", "name", "durability", "reductionsId" FROM "temporary_armor_class"`);
        await queryRunner.query(`DROP TABLE "temporary_armor_class"`);
        await queryRunner.query(`DROP TABLE "armor"`);
        await queryRunner.query(`DROP TABLE "armor_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "armor_instance"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "armor_location"`);
        await queryRunner.query(`DROP TABLE "equip_location"`);
        await queryRunner.query(`DROP TABLE "armor_instance_damage_reduction"`);
        await queryRunner.query(`DROP TABLE "armor_class_damage_reduction"`);
        await queryRunner.query(`DROP TABLE "armor_class"`);
        await queryRunner.query(`DROP TABLE "armor_attribute"`);
    }

}
