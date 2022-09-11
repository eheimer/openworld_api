import { MigrationInterface, QueryRunner } from "typeorm";

export class slayerTypeSpellbooks1662912232940 implements MigrationInterface {
    name = 'slayerTypeSpellbooks1662912232940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "slayer_type" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "spellbook_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "value" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "spellbook_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "attributeId" integer NOT NULL, "skillId" integer, "slayerId" integer, "spellbookId" integer)`);
        await queryRunner.query(`CREATE TABLE "spellbook_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "inventoryId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "monster_slayers_slayer_type" ("monsterId" integer NOT NULL, "slayerTypeId" integer NOT NULL, PRIMARY KEY ("monsterId", "slayerTypeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2e2e6923869b90fd6c65558c15" ON "monster_slayers_slayer_type" ("monsterId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bbd834561b870c6049e80b7e2b" ON "monster_slayers_slayer_type" ("slayerTypeId") `);
        await queryRunner.query(`CREATE TABLE "temporary_spellbook_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "attributeId" integer NOT NULL, "skillId" integer, "slayerId" integer, "spellbookId" integer, CONSTRAINT "FK_adf09896259e997f27f16f2e915" FOREIGN KEY ("attributeId") REFERENCES "spellbook_attribute" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_37761fd630309458cb283115e3c" FOREIGN KEY ("skillId") REFERENCES "skill" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_03e96f4108be5187f064e078ec4" FOREIGN KEY ("slayerId") REFERENCES "slayer_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e3388e3c797c67bb2c4d790da7f" FOREIGN KEY ("spellbookId") REFERENCES "spellbook_instance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_spellbook_instance_attribute"("id", "createdAt", "updatedAt", "value", "attributeId", "skillId", "slayerId", "spellbookId") SELECT "id", "createdAt", "updatedAt", "value", "attributeId", "skillId", "slayerId", "spellbookId" FROM "spellbook_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "spellbook_instance_attribute"`);
        await queryRunner.query(`ALTER TABLE "temporary_spellbook_instance_attribute" RENAME TO "spellbook_instance_attribute"`);
        await queryRunner.query(`CREATE TABLE "temporary_spellbook_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "inventoryId" integer NOT NULL, CONSTRAINT "FK_65c44a0870a0a928e8c0d0777ca" FOREIGN KEY ("inventoryId") REFERENCES "inventory" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_spellbook_instance"("id", "createdAt", "updatedAt", "inventoryId") SELECT "id", "createdAt", "updatedAt", "inventoryId" FROM "spellbook_instance"`);
        await queryRunner.query(`DROP TABLE "spellbook_instance"`);
        await queryRunner.query(`ALTER TABLE "temporary_spellbook_instance" RENAME TO "spellbook_instance"`);
        await queryRunner.query(`DROP INDEX "IDX_2e2e6923869b90fd6c65558c15"`);
        await queryRunner.query(`DROP INDEX "IDX_bbd834561b870c6049e80b7e2b"`);
        await queryRunner.query(`CREATE TABLE "temporary_monster_slayers_slayer_type" ("monsterId" integer NOT NULL, "slayerTypeId" integer NOT NULL, CONSTRAINT "FK_2e2e6923869b90fd6c65558c15e" FOREIGN KEY ("monsterId") REFERENCES "monster" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_bbd834561b870c6049e80b7e2b4" FOREIGN KEY ("slayerTypeId") REFERENCES "slayer_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("monsterId", "slayerTypeId"))`);
        await queryRunner.query(`INSERT INTO "temporary_monster_slayers_slayer_type"("monsterId", "slayerTypeId") SELECT "monsterId", "slayerTypeId" FROM "monster_slayers_slayer_type"`);
        await queryRunner.query(`DROP TABLE "monster_slayers_slayer_type"`);
        await queryRunner.query(`ALTER TABLE "temporary_monster_slayers_slayer_type" RENAME TO "monster_slayers_slayer_type"`);
        await queryRunner.query(`CREATE INDEX "IDX_2e2e6923869b90fd6c65558c15" ON "monster_slayers_slayer_type" ("monsterId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bbd834561b870c6049e80b7e2b" ON "monster_slayers_slayer_type" ("slayerTypeId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_bbd834561b870c6049e80b7e2b"`);
        await queryRunner.query(`DROP INDEX "IDX_2e2e6923869b90fd6c65558c15"`);
        await queryRunner.query(`ALTER TABLE "monster_slayers_slayer_type" RENAME TO "temporary_monster_slayers_slayer_type"`);
        await queryRunner.query(`CREATE TABLE "monster_slayers_slayer_type" ("monsterId" integer NOT NULL, "slayerTypeId" integer NOT NULL, PRIMARY KEY ("monsterId", "slayerTypeId"))`);
        await queryRunner.query(`INSERT INTO "monster_slayers_slayer_type"("monsterId", "slayerTypeId") SELECT "monsterId", "slayerTypeId" FROM "temporary_monster_slayers_slayer_type"`);
        await queryRunner.query(`DROP TABLE "temporary_monster_slayers_slayer_type"`);
        await queryRunner.query(`CREATE INDEX "IDX_bbd834561b870c6049e80b7e2b" ON "monster_slayers_slayer_type" ("slayerTypeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e2e6923869b90fd6c65558c15" ON "monster_slayers_slayer_type" ("monsterId") `);
        await queryRunner.query(`ALTER TABLE "spellbook_instance" RENAME TO "temporary_spellbook_instance"`);
        await queryRunner.query(`CREATE TABLE "spellbook_instance" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "inventoryId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "spellbook_instance"("id", "createdAt", "updatedAt", "inventoryId") SELECT "id", "createdAt", "updatedAt", "inventoryId" FROM "temporary_spellbook_instance"`);
        await queryRunner.query(`DROP TABLE "temporary_spellbook_instance"`);
        await queryRunner.query(`ALTER TABLE "spellbook_instance_attribute" RENAME TO "temporary_spellbook_instance_attribute"`);
        await queryRunner.query(`CREATE TABLE "spellbook_instance_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "value" integer NOT NULL, "attributeId" integer NOT NULL, "skillId" integer, "slayerId" integer, "spellbookId" integer)`);
        await queryRunner.query(`INSERT INTO "spellbook_instance_attribute"("id", "createdAt", "updatedAt", "value", "attributeId", "skillId", "slayerId", "spellbookId") SELECT "id", "createdAt", "updatedAt", "value", "attributeId", "skillId", "slayerId", "spellbookId" FROM "temporary_spellbook_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "temporary_spellbook_instance_attribute"`);
        await queryRunner.query(`DROP INDEX "IDX_bbd834561b870c6049e80b7e2b"`);
        await queryRunner.query(`DROP INDEX "IDX_2e2e6923869b90fd6c65558c15"`);
        await queryRunner.query(`DROP TABLE "monster_slayers_slayer_type"`);
        await queryRunner.query(`DROP TABLE "spellbook_instance"`);
        await queryRunner.query(`DROP TABLE "spellbook_instance_attribute"`);
        await queryRunner.query(`DROP TABLE "spellbook_attribute"`);
        await queryRunner.query(`DROP TABLE "slayer_type"`);
    }

}
