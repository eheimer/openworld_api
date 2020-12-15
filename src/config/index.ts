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
    mongo: {
        url: string,
        useCreateIndex: boolean,
        autoIndex: boolean
    }
    morganLogger: boolean
    morganBodyLogger: boolean
    openworldDevLogger: boolean
    loggerLevel: LogLevel
    privateKeyFile: string
    privateKeyPassphrase: string
    publicKeyFile: string
}

const config: Config = {
    mongo: {
        url: parsedEnv.MONGO_URL as string,
        useCreateIndex: parsedEnv.MONGO_CREATE_INDEX as boolean,
        autoIndex: parsedEnv.MONGO_AUTO_INDEX as boolean
    },
    morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
    morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
    openworldDevLogger: parsedEnv.OPENWORLD_DEV_LOGGER as boolean,
    loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
    privateKeyFile: parsedEnv.PRIVATE_KEY_FILE as string,
    privateKeyPassphrase: parsedEnv.PRIVATE_KEY_PASSPHRASE as string,
    publicKeyFile: parsedEnv.PUBLIC_KEY_FILE as string,
}

export default config