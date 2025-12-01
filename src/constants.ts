import { loadEnvironmentConfig } from './config/env'

// Load environment configuration
const envConfig = loadEnvironmentConfig()

// Validate that JWT_SECRET is defined
if (!envConfig.jwt.secret) {
  throw new Error('JWT_SECRET environment variable is required but not defined')
}

export const jwtConstants = {
  secret: envConfig.jwt.secret
}
