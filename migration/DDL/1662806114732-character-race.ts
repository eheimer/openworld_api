import { MigrationInterface, QueryRunner } from 'typeorm'

export class characterRace1662806114732 implements MigrationInterface {
  name = 'characterRace1662806114732'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_character" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "hp" integer NOT NULL DEFAULT (1), "mana" integer NOT NULL DEFAULT (0), "strength" integer NOT NULL, "dexterity" integer NOT NULL, "intelligence" integer NOT NULL, "sleep" integer NOT NULL DEFAULT (1), "hunger" integer NOT NULL DEFAULT (1), "stamina" integer NOT NULL DEFAULT (1), "gameId" integer NOT NULL, "playerId" integer NOT NULL, "raceId" integer, CONSTRAINT "FK_5b277d0c9baa952e5c9a95e59a5" FOREIGN KEY ("playerId") REFERENCES "player" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_deaa8cb01bd0a343e8b649d32ce" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_character"("id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId") SELECT "id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId" FROM "character"`
    )
    await queryRunner.query(`DROP TABLE "character"`)
    await queryRunner.query(`ALTER TABLE "temporary_character" RENAME TO "character"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_character" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "hp" integer NOT NULL DEFAULT (1), "mana" integer NOT NULL DEFAULT (0), "strength" integer NOT NULL, "dexterity" integer NOT NULL, "intelligence" integer NOT NULL, "sleep" integer NOT NULL DEFAULT (1), "hunger" integer NOT NULL DEFAULT (1), "stamina" integer NOT NULL DEFAULT (1), "gameId" integer NOT NULL, "playerId" integer NOT NULL, "raceId" integer, CONSTRAINT "FK_5b277d0c9baa952e5c9a95e59a5" FOREIGN KEY ("playerId") REFERENCES "player" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_deaa8cb01bd0a343e8b649d32ce" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a7485d062b19695002b6175e8fb" FOREIGN KEY ("raceId") REFERENCES "race" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_character"("id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId", "raceId") SELECT "id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId", "raceId" FROM "character"`
    )
    await queryRunner.query(`DROP TABLE "character"`)
    await queryRunner.query(`ALTER TABLE "temporary_character" RENAME TO "character"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "character" RENAME TO "temporary_character"`)
    await queryRunner.query(
      `CREATE TABLE "character" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "hp" integer NOT NULL DEFAULT (1), "mana" integer NOT NULL DEFAULT (0), "strength" integer NOT NULL, "dexterity" integer NOT NULL, "intelligence" integer NOT NULL, "sleep" integer NOT NULL DEFAULT (1), "hunger" integer NOT NULL DEFAULT (1), "stamina" integer NOT NULL DEFAULT (1), "gameId" integer NOT NULL, "playerId" integer NOT NULL, "raceId" integer, CONSTRAINT "FK_5b277d0c9baa952e5c9a95e59a5" FOREIGN KEY ("playerId") REFERENCES "player" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_deaa8cb01bd0a343e8b649d32ce" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "character"("id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId", "raceId") SELECT "id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId", "raceId" FROM "temporary_character"`
    )
    await queryRunner.query(`DROP TABLE "temporary_character"`)
    await queryRunner.query(`ALTER TABLE "character" RENAME TO "temporary_character"`)
    await queryRunner.query(
      `CREATE TABLE "character" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "hp" integer NOT NULL DEFAULT (1), "mana" integer NOT NULL DEFAULT (0), "strength" integer NOT NULL, "dexterity" integer NOT NULL, "intelligence" integer NOT NULL, "sleep" integer NOT NULL DEFAULT (1), "hunger" integer NOT NULL DEFAULT (1), "stamina" integer NOT NULL DEFAULT (1), "gameId" integer NOT NULL, "playerId" integer NOT NULL, CONSTRAINT "FK_5b277d0c9baa952e5c9a95e59a5" FOREIGN KEY ("playerId") REFERENCES "player" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_deaa8cb01bd0a343e8b649d32ce" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "character"("id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId") SELECT "id", "createdAt", "updatedAt", "name", "hp", "mana", "strength", "dexterity", "intelligence", "sleep", "hunger", "stamina", "gameId", "playerId" FROM "temporary_character"`
    )
    await queryRunner.query(`DROP TABLE "temporary_character"`)
  }
}
