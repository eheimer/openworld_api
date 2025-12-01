/**
 * Unit tests for the environment configuration loader (env.ts)
 *
 * WHAT THIS TESTS:
 * - Validation logic: Ensures required variables are present and valid
 * - Default value logic: Verifies correct defaults are applied based on environment
 * - Type conversion: Confirms string environment variables are parsed to correct types
 * - Error handling: Validates descriptive error messages for missing/invalid configuration
 * - Environment-specific behavior: Tests different logic paths for dev/test/prod environments
 *
 * WHAT THIS DOES NOT TEST:
 * - Actual .env file loading from disk (dotenv-extended is mocked)
 * - Real database connections or JWT token operations
 * - Integration with TypeORM or other application components
 * - File system permissions or .env file existence
 *
 * This is a pure unit test suite focused on the configuration parsing and validation logic.
 * Integration tests should verify that the configuration works with actual .env files and
 * that the application can successfully connect to databases using the loaded configuration.
 */

import { loadEnvironmentConfig } from './env'
import * as dotenv from 'dotenv-extended'

// Mock dotenv-extended to control environment loading in tests
jest.mock('dotenv-extended')

describe('Environment Configuration Loader', () => {
  const mockDotenvLoad = dotenv.load as jest.MockedFunction<typeof dotenv.load>
  let originalNodeEnv: string | undefined

  beforeEach(() => {
    // Save and clear NODE_ENV
    originalNodeEnv = process.env.NODE_ENV
    // Reset mock before each test
    mockDotenvLoad.mockReset()
  })

  afterEach(() => {
    // Restore NODE_ENV
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv
    } else {
      delete process.env.NODE_ENV
    }
    jest.clearAllMocks()
  })

  describe('loadEnvironmentConfig', () => {
    it('should be defined', () => {
      expect(loadEnvironmentConfig).toBeDefined()
    })

    it('should load configuration with all variables present for MySQL', () => {
      process.env.NODE_ENV = 'prod'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_HOST: 'testhost',
        DB_PORT: '3307',
        DB_USERNAME: 'testuser',
        DB_PASSWORD: 'testpass',
        DB_NAME: 'testdb',
        JWT_SECRET: 'test-jwt-secret-with-minimum-32-chars'
      })

      const config = loadEnvironmentConfig()

      expect(config.nodeEnv).toBe('prod')
      expect(config.database.type).toBe('mysql')
      expect(config.database.host).toBe('testhost')
      expect(config.database.port).toBe(3307)
      expect(config.database.username).toBe('testuser')
      expect(config.database.password).toBe('testpass')
      expect(config.database.database).toBe('testdb')
      expect(config.jwt.secret).toBe('test-jwt-secret-with-minimum-32-chars')
    })

    it('should load configuration with all variables present for SQLite', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'sqlite',
        DB_NAME: 'test.sqlite',
        JWT_SECRET: 'test-jwt-secret'
      })

      const config = loadEnvironmentConfig()

      expect(config.nodeEnv).toBe('dev')
      expect(config.database.type).toBe('sqlite')
      expect(config.database.database).toBe('test.sqlite')
      expect(config.database.host).toBeUndefined()
      expect(config.database.port).toBeUndefined()
      expect(config.database.username).toBeUndefined()
      expect(config.database.password).toBeUndefined()
      expect(config.jwt.secret).toBe('test-jwt-secret')
    })

    it('should use defaults for missing optional MySQL variables in non-production', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_NAME: 'testdb',
        JWT_SECRET: 'test-jwt-secret'
      })

      const config = loadEnvironmentConfig()

      expect(config.database.type).toBe('mysql')
      expect(config.database.host).toBe('localhost')
      expect(config.database.port).toBe(3306)
      expect(config.database.username).toBe('openworld')
      expect(config.database.password).toBe('')
      expect(config.database.database).toBe('testdb')
    })

    it('should default to SQLite in dev environment when DB_TYPE is not specified', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_NAME: 'dev.sqlite',
        JWT_SECRET: 'test-jwt-secret'
      })

      const config = loadEnvironmentConfig()

      expect(config.database.type).toBe('sqlite')
      expect(config.database.database).toBe('dev.sqlite')
    })

    it('should default to MySQL in prod environment when DB_TYPE is not specified', () => {
      process.env.NODE_ENV = 'prod'
      mockDotenvLoad.mockReturnValue({
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_NAME: 'proddb',
        JWT_SECRET: 'test-jwt-secret-with-minimum-32-chars'
      })

      const config = loadEnvironmentConfig()

      expect(config.database.type).toBe('mysql')
    })

    it('should throw error when DB_NAME is missing', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        JWT_SECRET: 'test-jwt-secret'
      })

      expect(() => loadEnvironmentConfig()).toThrow('Missing required environment variable: DB_NAME')
    })

    it('should throw error when JWT_SECRET is missing', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_NAME: 'test.sqlite'
      })

      expect(() => loadEnvironmentConfig()).toThrow('Missing required environment variable: JWT_SECRET')
    })

    it('should throw error when DB_HOST is missing in production with MySQL', () => {
      process.env.NODE_ENV = 'prod'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_NAME: 'proddb',
        JWT_SECRET: 'test-jwt-secret-with-minimum-32-chars'
      })

      expect(() => loadEnvironmentConfig()).toThrow('Missing required environment variable: DB_HOST')
    })

    it('should throw error when DB_PORT is missing in production with MySQL', () => {
      process.env.NODE_ENV = 'prod'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_HOST: 'localhost',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_NAME: 'proddb',
        JWT_SECRET: 'test-jwt-secret-with-minimum-32-chars'
      })

      expect(() => loadEnvironmentConfig()).toThrow('Missing required environment variable: DB_PORT')
    })

    it('should throw error when DB_USERNAME is missing in production with MySQL', () => {
      process.env.NODE_ENV = 'prod'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_PASSWORD: 'pass',
        DB_NAME: 'proddb',
        JWT_SECRET: 'test-jwt-secret-with-minimum-32-chars'
      })

      expect(() => loadEnvironmentConfig()).toThrow('Missing required environment variable: DB_USERNAME')
    })

    it('should throw error when DB_PASSWORD is missing in production with MySQL', () => {
      process.env.NODE_ENV = 'prod'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_NAME: 'proddb',
        JWT_SECRET: 'test-jwt-secret-with-minimum-32-chars'
      })

      expect(() => loadEnvironmentConfig()).toThrow('Missing required environment variable: DB_PASSWORD')
    })

    it('should throw error for invalid DB_TYPE', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'postgres',
        DB_NAME: 'testdb',
        JWT_SECRET: 'test-jwt-secret'
      })

      expect(() => loadEnvironmentConfig()).toThrow("Invalid DB_TYPE: postgres. Must be 'mysql' or 'sqlite'")
    })

    it('should throw error for invalid DB_PORT value', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_PORT: '99999',
        DB_NAME: 'testdb',
        JWT_SECRET: 'test-jwt-secret'
      })

      expect(() => loadEnvironmentConfig()).toThrow('Invalid DB_PORT: 99999. Must be a number between 1 and 65535')
    })

    it('should throw error for JWT_SECRET shorter than 32 characters in production', () => {
      process.env.NODE_ENV = 'prod'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_NAME: 'proddb',
        JWT_SECRET: 'short'
      })

      expect(() => loadEnvironmentConfig()).toThrow('JWT_SECRET must be at least 32 characters in production')
    })

    it('should allow JWT_SECRET shorter than 32 characters in development', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_NAME: 'dev.sqlite',
        JWT_SECRET: 'short'
      })

      const config = loadEnvironmentConfig()

      expect(config.jwt.secret).toBe('short')
    })

    it('should handle test environment correctly', () => {
      process.env.NODE_ENV = 'test'
      mockDotenvLoad.mockReturnValue({
        DB_NAME: 'test.sqlite',
        JWT_SECRET: 'test-secret'
      })

      const config = loadEnvironmentConfig()

      expect(config.nodeEnv).toBe('test')
      expect(config.database.type).toBe('sqlite')
      expect(config.database.database).toBe('test.sqlite')
      expect(config.jwt.secret).toBe('test-secret')
    })

    it('should default to dev environment when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV
      mockDotenvLoad.mockReturnValue({
        DB_NAME: 'default.sqlite',
        JWT_SECRET: 'test-secret'
      })

      const config = loadEnvironmentConfig()

      expect(config.nodeEnv).toBe('dev')
    })

    it('should parse DB_PORT as number', () => {
      process.env.NODE_ENV = 'dev'
      mockDotenvLoad.mockReturnValue({
        DB_TYPE: 'mysql',
        DB_PORT: '5432',
        DB_NAME: 'testdb',
        JWT_SECRET: 'test-jwt-secret'
      })

      const config = loadEnvironmentConfig()

      expect(config.database.port).toBe(5432)
      expect(typeof config.database.port).toBe('number')
    })
  })
})
