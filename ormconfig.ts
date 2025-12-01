import { loadEnvironmentConfig } from './src/config/env'

// Load environment configuration
const envConfig = loadEnvironmentConfig()
const env: string = envConfig.nodeEnv

// Build base configuration from environment variables
const configDefault: any = {
  type: envConfig.database.type,
  synchronize: false,
  logging: 'warn',
  entities: ['dist/src/**/*.entity.js'],
  subscribers: ['dist/src/**/*.subscriber.js']
}

// Add database connection parameters based on type
if (envConfig.database.type === 'mysql') {
  configDefault.host = envConfig.database.host
  configDefault.port = envConfig.database.port
  configDefault.username = envConfig.database.username
  configDefault.password = envConfig.database.password
  configDefault.database = envConfig.database.database
} else {
  configDefault.database = envConfig.database.database
}

// Environment-specific overrides for synchronize, logging, and entity paths
const envOverrides: any = {
  test: {
    synchronize: true,
    logging: false,
    entities: ['src/**/*.entity.ts'],
    subscribers: ['src/**/*.subscriber.ts']
  },
  dev: {
    synchronize: true,
    logging: 'warn',
    entities: ['dist/src/**/*.entity.js'],
    subscribers: ['dist/src/**/*.subscriber.js']
  },
  prod: {
    synchronize: false
  }
}

const config = envOverrides[env] || {}

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
