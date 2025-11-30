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
  entities: ['dist/src/**/*.entity.js'],
  subscribers: ['dist/src/**/*.subscriber.js']
}

// these env values override the defaults
const dbConfig = {
  test: {
    type: 'sqlite',
    database: 'test.sqlite',
    synchronize: true,
    logging: false,
    entities: ['src/**/*.entity.ts'],
    subscribers: ['src/**/*.subscriber.ts']
  },
  dev: {
    type: 'sqlite',
    database: 'dev.sqlite',
    synchronize: true,
    logging: 'warn',
    entities: ['dist/src/**/*.entity.js'],
    subscribers: ['dist/src/**/*.subscriber.js']
    //   logging: ['query', 'parameters']
  },
  prod: {
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    synchronize: false,
    username: 'openworld',
    password: 'entranced',
    database: 'openworld'
  }
}

// again, default to 'dev' if an environment is not specified
// to prevent production data from being overwritten
const env: string = process.env.NODE_ENV || 'dev'
const config = dbConfig[env]

const cliOptions = {
  migrationsDir: 'migration',
  migrationsTableName: 'migration_history'
}
if (process.env['TYPEORM_CLI'] === '1') {
  let migrationsForCli: string[]
  if (env === 'dev') {
    migrationsForCli = ['migration/DML/*.ts']
  } else if (env === 'test') {
    migrationsForCli = ['migration/DML/test/*.ts', 'migration/DML/*.ts']
  } else {
    migrationsForCli = ['migration/DDL/*.ts', 'migration/DML/*.ts']
  }

  const cliOptionsForEnv = Object.assign({}, cliOptions, { migrations: migrationsForCli })
  Object.assign(config, cliOptionsForEnv)
}

if (!config) {
  throw new Error(`unknown environment: ${env}`)
}

export const dbconfig = Object.assign(configDefault, config)
export default dbconfig
