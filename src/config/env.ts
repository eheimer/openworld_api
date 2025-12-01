import * as dotenv from 'dotenv-extended'
import * as path from 'path'

// dotenv-parse-variables uses default export
const dotenvParseVariables = require('dotenv-parse-variables')

/**
 * Environment configuration structure
 */
export interface EnvironmentConfig {
  nodeEnv: string
  database: {
    type: 'mysql' | 'sqlite'
    host?: string
    port?: number
    username?: string
    password?: string
    database: string
  }
  jwt: {
    secret: string
  }
}

/**
 * Load and validate environment configuration
 * 
 * Loads environment variables from .env files based on NODE_ENV:
 * - dev: config/.env.dev
 * - test: config/.env.test
 * - prod: /var/www/openworld-api/.env.prod (production server only)
 * 
 * @returns {EnvironmentConfig} Validated environment configuration
 * @throws {Error} If required environment variables are missing or invalid
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv = process.env.NODE_ENV || 'dev'

  // Determine which .env file to load based on NODE_ENV
  let envPath: string
  if (nodeEnv === 'prod') {
    // Production: load from /var/www/openworld-api/.env.prod (not committed to git)
    envPath = '/var/www/openworld-api/.env.prod'
  } else {
    // Development/Test: load from config directory (committed to git with defaults)
    envPath = path.join(process.cwd(), 'config', `.env.${nodeEnv}`)
  }

  // Load environment variables from file
  // silent: true means don't throw if file doesn't exist (production may use system env vars)
  const rawEnv = dotenv.load({
    path: envPath,
    silent: true,
    includeProcessEnv: true
  })

  // Parse variables (converts strings to appropriate types)
  const parsedEnv = dotenvParseVariables(rawEnv)

  // Build and validate configuration
  const config: EnvironmentConfig = {
    nodeEnv,
    database: buildDatabaseConfig(parsedEnv, nodeEnv),
    jwt: buildJwtConfig(parsedEnv, nodeEnv)
  }

  return config
}

/**
 * Build database configuration from environment variables
 */
function buildDatabaseConfig(env: any, nodeEnv: string): EnvironmentConfig['database'] {
  // Determine database type with defaults
  const dbType = (env.DB_TYPE || (nodeEnv === 'prod' ? 'mysql' : 'sqlite')) as 'mysql' | 'sqlite'

  // Validate database type
  if (dbType !== 'mysql' && dbType !== 'sqlite') {
    throw new Error(`Invalid DB_TYPE: ${dbType}. Must be 'mysql' or 'sqlite'`)
  }

  // Get database name (required for all environments)
  const database = env.DB_NAME
  if (!database) {
    throw new Error('Missing required environment variable: DB_NAME')
  }

  // For SQLite, only database name is needed
  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database
    }
  }

  // For MySQL, additional connection parameters are required
  const host = env.DB_HOST
  const port = env.DB_PORT
  const username = env.DB_USERNAME
  const password = env.DB_PASSWORD

  // In production, all MySQL connection parameters are required
  if (nodeEnv === 'prod') {
    if (!host) {
      throw new Error('Missing required environment variable: DB_HOST')
    }
    if (!port) {
      throw new Error('Missing required environment variable: DB_PORT')
    }
    if (!username) {
      throw new Error('Missing required environment variable: DB_USERNAME')
    }
    if (!password) {
      throw new Error('Missing required environment variable: DB_PASSWORD')
    }
  }

  // Validate port is a number
  if (port && (typeof port !== 'number' || port < 1 || port > 65535)) {
    throw new Error(`Invalid DB_PORT: ${port}. Must be a number between 1 and 65535`)
  }

  return {
    type: 'mysql',
    host: host || 'localhost',
    port: port || 3306,
    username: username || 'openworld',
    password: password || '',
    database
  }
}

/**
 * Build JWT configuration from environment variables
 */
function buildJwtConfig(env: any, nodeEnv: string): EnvironmentConfig['jwt'] {
  const secret = env.JWT_SECRET

  // JWT secret is always required
  if (!secret) {
    throw new Error('Missing required environment variable: JWT_SECRET')
  }

  // In production, enforce minimum secret length for security
  if (nodeEnv === 'prod' && secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production')
  }

  return {
    secret
  }
}
