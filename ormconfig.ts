//defaults are based on dev environment
//this is so that if other environments are not
//set up correctly, we won't overwrite any data
//if dev gets overwritten, we don't care
const configDefault = {
  type: 'sqlite',
  database: 'dev.sqlite',
  synchronize: false,
  logging: 'warn',
  entities: ['**/*.entity.js'],
  migrations: [`migrations/*.js`],
  subscribers: ['subscribers/*.js'],
  cli: {
    migationsDir: 'migrations'
  }
}

// these env values override the defaults
const dbConfig = {
  test: {
    database: 'test.sqlite',
    entities: [`**/*.entity.ts`]
  },
  dev: {},
  prod: {
    type: 'mysql',
    server: 'localhost',
    port: '3306',
    username: 'openworld',
    password: 'entranced',
    database: 'openworld'
  }
}

// again, default to 'dev' if an environment is not specified
// to prevent production data from being overwritten
const env: string = process.env.NODE_ENV || 'dev'
const config = dbConfig[env]

if (!config) {
  throw new Error(`unknown environment: ${env}`)
}

export const dbconfig = Object.assign(configDefault, config)
