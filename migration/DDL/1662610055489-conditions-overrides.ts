import { MigrationInterface, QueryRunner } from "typeorm";

export class conditionsOverrides1662610055489 implements MigrationInterface {
    name = 'conditionsOverrides1662610055489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "condition_overrides_condition" ("conditionId_1" integer NOT NULL, "conditionId_2" integer NOT NULL, PRIMARY KEY ("conditionId_1", "conditionId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b74b22dfc4b885ca55f5914d36" ON "condition_overrides_condition" ("conditionId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a083e2fd9df823e15686f3004" ON "condition_overrides_condition" ("conditionId_2") `);
        await queryRunner.query(`DROP INDEX "IDX_b74b22dfc4b885ca55f5914d36"`);
        await queryRunner.query(`DROP INDEX "IDX_6a083e2fd9df823e15686f3004"`);
        await queryRunner.query(`CREATE TABLE "temporary_condition_overrides_condition" ("conditionId_1" integer NOT NULL, "conditionId_2" integer NOT NULL, CONSTRAINT "FK_b74b22dfc4b885ca55f5914d36e" FOREIGN KEY ("conditionId_1") REFERENCES "condition" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_6a083e2fd9df823e15686f30044" FOREIGN KEY ("conditionId_2") REFERENCES "condition" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("conditionId_1", "conditionId_2"))`);
        await queryRunner.query(`INSERT INTO "temporary_condition_overrides_condition"("conditionId_1", "conditionId_2") SELECT "conditionId_1", "conditionId_2" FROM "condition_overrides_condition"`);
        await queryRunner.query(`DROP TABLE "condition_overrides_condition"`);
        await queryRunner.query(`ALTER TABLE "temporary_condition_overrides_condition" RENAME TO "condition_overrides_condition"`);
        await queryRunner.query(`CREATE INDEX "IDX_b74b22dfc4b885ca55f5914d36" ON "condition_overrides_condition" ("conditionId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a083e2fd9df823e15686f3004" ON "condition_overrides_condition" ("conditionId_2") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_6a083e2fd9df823e15686f3004"`);
        await queryRunner.query(`DROP INDEX "IDX_b74b22dfc4b885ca55f5914d36"`);
        await queryRunner.query(`ALTER TABLE "condition_overrides_condition" RENAME TO "temporary_condition_overrides_condition"`);
        await queryRunner.query(`CREATE TABLE "condition_overrides_condition" ("conditionId_1" integer NOT NULL, "conditionId_2" integer NOT NULL, PRIMARY KEY ("conditionId_1", "conditionId_2"))`);
        await queryRunner.query(`INSERT INTO "condition_overrides_condition"("conditionId_1", "conditionId_2") SELECT "conditionId_1", "conditionId_2" FROM "temporary_condition_overrides_condition"`);
        await queryRunner.query(`DROP TABLE "temporary_condition_overrides_condition"`);
        await queryRunner.query(`CREATE INDEX "IDX_6a083e2fd9df823e15686f3004" ON "condition_overrides_condition" ("conditionId_2") `);
        await queryRunner.query(`CREATE INDEX "IDX_b74b22dfc4b885ca55f5914d36" ON "condition_overrides_condition" ("conditionId_1") `);
        await queryRunner.query(`DROP INDEX "IDX_6a083e2fd9df823e15686f3004"`);
        await queryRunner.query(`DROP INDEX "IDX_b74b22dfc4b885ca55f5914d36"`);
        await queryRunner.query(`DROP TABLE "condition_overrides_condition"`);
    }

}
