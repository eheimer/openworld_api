import { MigrationInterface, QueryRunner } from 'typeorm'

export class race1662801035098 implements MigrationInterface {
  name = 'race1662801035098'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "race" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "description" text NOT NULL, "name" varchar NOT NULL, "movement" varchar NOT NULL, "hpReplenish" integer NOT NULL, "manaReplenish" integer NOT NULL, "staminaReplenish" integer NOT NULL, "hunger" integer, "sleep" integer)`
    )
    await queryRunner.query(
      `CREATE TABLE "race_skill" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "level" integer NOT NULL, "raceId" integer, "skillId" integer)`
    )
    await queryRunner.query(
      `CREATE TABLE "temporary_race_skill" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "level" integer NOT NULL, "raceId" integer, "skillId" integer, CONSTRAINT "FK_ef48966f9cfe3b60e02650dab48" FOREIGN KEY ("raceId") REFERENCES "race" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f1cee220a1c2d5975345de0ba8f" FOREIGN KEY ("skillId") REFERENCES "skill" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_race_skill"("id", "createdAt", "updatedAt", "level", "raceId", "skillId") SELECT "id", "createdAt", "updatedAt", "level", "raceId", "skillId" FROM "race_skill"`
    )
    await queryRunner.query(`DROP TABLE "race_skill"`)
    await queryRunner.query(`ALTER TABLE "temporary_race_skill" RENAME TO "race_skill"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "race_skill" RENAME TO "temporary_race_skill"`)
    await queryRunner.query(
      `CREATE TABLE "race_skill" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "level" integer NOT NULL, "raceId" integer, "skillId" integer)`
    )
    await queryRunner.query(
      `INSERT INTO "race_skill"("id", "createdAt", "updatedAt", "level", "raceId", "skillId") SELECT "id", "createdAt", "updatedAt", "level", "raceId", "skillId" FROM "temporary_race_skill"`
    )
    await queryRunner.query(`DROP TABLE "temporary_race_skill"`)
    await queryRunner.query(`DROP TABLE "race_skill"`)
    await queryRunner.query(`DROP TABLE "race"`)
  }
}
