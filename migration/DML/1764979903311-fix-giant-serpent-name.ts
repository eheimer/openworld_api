import { MigrationInterface, QueryRunner } from "typeorm";

export class FixGiantSerpentName1764979903311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE monster SET name = 'Giant Serpent' WHERE name = 'Serpent,Giant'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE monster SET name = 'Serpent,Giant' WHERE name = 'Giant Serpent'`)
    }

}
