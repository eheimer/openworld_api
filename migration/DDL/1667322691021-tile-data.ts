import { MigrationInterface, QueryRunner } from 'typeorm'

export class tileData1667322691021 implements MigrationInterface {
  name = 'tileData1667322691021'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`map\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`tileIndex\` int NOT NULL, \`terrain\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`map\``)
  }
}
