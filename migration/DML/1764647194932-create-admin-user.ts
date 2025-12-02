import { MigrationInterface, QueryRunner } from 'typeorm'
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

export class CreateAdminUser1764647194932 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if admin user already exists
    const existingUser = await queryRunner.query(
      `SELECT id FROM \`player\` WHERE username = 'owadmin' LIMIT 1`
    )

    if (existingUser && existingUser.length > 0) {
      console.log('Admin user "owadmin" already exists, skipping creation')
      return
    }

    // Generate password: two memorable words separated by underscore
    const password = 'forest_dragon'

    // Generate salt and hash password using scrypt (same as auth service)
    const salt = randomBytes(8).toString('hex')
    const hash = (await scrypt(password, salt, 64)) as Buffer
    const hashedPassword = `${salt}.${hash.toString('hex')}`

    // Create admin user (createdAt and updatedAt handled automatically by TypeORM)
    await queryRunner.query(
      `INSERT INTO \`player\` (\`username\`, \`password\`, \`email\`, \`isAdmin\`) 
       VALUES ('owadmin', '${hashedPassword}', 'admin@openworld.local', 1)`
    )

    console.log('Admin user "owadmin" created successfully')
    console.log('Username: owadmin')
    console.log('Password: forest_dragon')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove admin user
    await queryRunner.query(`DELETE FROM \`player\` WHERE username = 'owadmin'`)
    console.log('Admin user "owadmin" removed')
  }
}
