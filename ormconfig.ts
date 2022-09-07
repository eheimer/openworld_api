import { DataSource } from 'typeorm'

const configDefault = {
  synchronize: false,
  migrations: [`migrations/*.js`],
  cli: {
    migationsDir: 'migrations'
  },
  subscribers: ['subscribers/*.js']
}

// these env values override the defaults
const dbConfig = {
  test: {
    type: 'sqlite',
    database: 'test.sqlite',
    logging: 'warn',
    entities: [`**/*.entity.ts`]
  },
  dev: {
    type: 'sqlite',
    database: 'dev.sqlite',
    logging: 'debug',
    entities: [`**/*.entity.js`]
  },
  prod: {
    type: 'mysql',
    server: 'localhost',
    port: '3306',
    username: 'openworld',
    password: 'entranced',
    database: 'openworld',
    logging: 'all',
    entities: [`**/*.entity.js`]
  }
}

const env: string = process.env.NODE_ENV || 'development'
const config = dbConfig[env]

if (!config) {
  throw new Error(`unknown environment: ${env}`)
}

export const dbconfig = Object.assign(configDefault, config)
