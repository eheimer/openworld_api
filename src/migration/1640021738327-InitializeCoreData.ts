import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import DB from '../utils/db';
import { DamageTypeSeed } from '../seed/DamageType.seed';

export class InitializeCoreData1640021738327 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const dmgTypes = await getRepository('DamageType',DB.getInstance().conn).save(DamageTypeSeed)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
