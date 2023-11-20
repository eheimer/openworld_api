//defaults are based on dev environment
//this is so that if other environments are not
//set up correctly, we won't overwrite any data
//if dev gets overwritten, we don't care
const configDefault = {
  type: 'mysql',
  host: '127.0.0.1',
  port: '3306',
  database: 'openworld',
  username: 'openworld',
  password: 'entranced',
  synchronize: false,
  logging: 'warn',
  entities: ['**/*.entity.js'],
  subscribers: ['**/*.subscriber.js']
}

// these env values override the defaults
const dbConfig = {
  test: {
    type: 'sqlite',
    database: 'test.sqlite',
    entities: [`**/*.entity.ts`],
    subscribers: [`**/*.subscriber.ts`]
  },
  dev: {
    logging: ['query', 'parameters']
  },
  prod: {
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    username: 'openworld',
    password: 'entranced',
    database: 'openworld'
  }
}

/* it's important that these properties are not set for the dev environment 
      because the TypeOrmModule pukes on the .ts files when the nestjs app starts up. */
const cliOptions = {
  migrations: [`migration/DDL/*.ts`, `migration/DML/*.ts`],
  migrationsDir: 'migration',
  migrationsTableName: 'migration_history'
}

// again, default to 'dev' if an environment is not specified
// to prevent production data from being overwritten
const env: string = process.env.NODE_ENV || 'dev'
const config = dbConfig[env]

if (process.env['TYPEORM_CLI'] === '1') {
  Object.assign(config, cliOptions)
}

if (!config) {
  throw new Error(`unknown environment: ${env}`)
}

export const dbconfig = Object.assign(configDefault, config)
