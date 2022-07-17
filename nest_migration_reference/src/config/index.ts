import dotenvExtended from 'dotenv-extended'
import dotenvParseVariables from 'dotenv-parse-variables'

const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: './config/.env.defaults',
  schema: './config/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true
})

const parsedEnv = dotenvParseVariables(env)
type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'

interface Config {
  env: string
  port: number
  morganLogger: boolean
  morganBodyLogger: boolean
  openworldDevLogger: boolean
  loggerLevel: LogLevel
  privateKeyFile: string
  privateKeyPassphrase: string
  publicKeyFile: string
  runMigrations: boolean
}

const config: Config = {
  env: parsedEnv.ENV as string,
  port: parsedEnv.HTTP_PORT as number,
  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  openworldDevLogger: parsedEnv.OPENWORLD_DEV_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
  privateKeyFile: parsedEnv.PRIVATE_KEY_FILE as string,
  privateKeyPassphrase: parsedEnv.PRIVATE_KEY_PASSPHRASE as string,
  publicKeyFile: parsedEnv.PUBLIC_KEY_FILE as string,
  runMigrations: parsedEnv.RUN_MIGRATIONS as boolean
}

export default config
