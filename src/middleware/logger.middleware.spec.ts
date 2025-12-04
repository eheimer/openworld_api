import { LoggerMiddleware } from './logger.middleware'
import { Reflector } from '@nestjs/core'
import { Request, Response } from 'express'
import { Logger } from '@nestjs/common'

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware
  let reflector: Reflector

  beforeEach(() => {
    reflector = new Reflector()
    middleware = new LoggerMiddleware(reflector)
    global['routeMap'] = {}
  })

  describe('maskSensitiveFields', () => {
    it('should mask password field in simple object', () => {
      const input = {
        username: 'player1',
        password: 'secretPassword123',
      }

      const result = middleware['maskSensitiveFields'](input)

      expect(result).toEqual({
        username: 'player1',
        password: '***REDACTED***',
      })
    })

    it('should return object unchanged when no sensitive fields present', () => {
      const input = {
        username: 'player1',
        email: 'player@example.com',
      }

      const result = middleware['maskSensitiveFields'](input)

      expect(result).toEqual({
        username: 'player1',
        email: 'player@example.com',
      })
    })

    it('should mask password field in nested object', () => {
      const input = {
        user: {
          username: 'player1',
          credentials: {
            password: 'secretPassword123',
          },
        },
      }

      const result = middleware['maskSensitiveFields'](input)

      expect(result).toEqual({
        user: {
          username: 'player1',
          credentials: {
            password: '***REDACTED***',
          },
        },
      })
    })

    it('should handle null and undefined', () => {
      expect(middleware['maskSensitiveFields'](null)).toBeNull()
      expect(middleware['maskSensitiveFields'](undefined)).toBeUndefined()
    })

    it('should handle primitives', () => {
      expect(middleware['maskSensitiveFields']('string')).toBe('string')
      expect(middleware['maskSensitiveFields'](123)).toBe(123)
      expect(middleware['maskSensitiveFields'](true)).toBe(true)
    })

    it('should mask sensitive fields in arrays', () => {
      const input = [
        { username: 'player1', password: 'secret1' },
        { username: 'player2', password: 'secret2' },
      ]

      const result = middleware['maskSensitiveFields'](input)

      expect(result).toEqual([
        { username: 'player1', password: '***REDACTED***' },
        { username: 'player2', password: '***REDACTED***' },
      ])
    })

    it('should mask all sensitive field types', () => {
      const input = {
        password: 'myPassword',
        token: 'myToken',
        apikey: 'myApiKey',
        secret: 'mySecret',
      }

      const result = middleware['maskSensitiveFields'](input)

      expect(result).toEqual({
        password: '***REDACTED***',
        token: '***REDACTED***',
        apikey: '***REDACTED***',
        secret: '***REDACTED***',
      })
    })

    it('should perform case-insensitive matching', () => {
      const input = {
        Password: 'secret1',
        PASSWORD: 'secret2',
        password: 'secret3',
        Token: 'token1',
        ApiKey: 'key1',
      }

      const result = middleware['maskSensitiveFields'](input)

      expect(result).toEqual({
        Password: '***REDACTED***',
        PASSWORD: '***REDACTED***',
        password: '***REDACTED***',
        Token: '***REDACTED***',
        ApiKey: '***REDACTED***',
      })
    })
  })

  describe('Integration with auth endpoints', () => {
    let loggerVerboseSpy: jest.SpyInstance

    beforeEach(() => {
      // Spy on Logger.verbose to capture log output
      loggerVerboseSpy = jest.spyOn(Logger, 'verbose').mockImplementation()
    })

    afterEach(() => {
      loggerVerboseSpy.mockRestore()
    })

    it('should mask password field in login request logs', () => {
      const mockRequest = {
        method: 'POST',
        path: '/auth/login',
        body: {
          username: 'testuser',
          password: 'secretPassword123',
        },
      } as Request

      const mockResponse = {} as Response
      const mockNext = jest.fn()

      middleware.use(mockRequest, mockResponse, mockNext)

      // Verify Logger.verbose was called
      expect(loggerVerboseSpy).toHaveBeenCalled()

      // Get the logged message
      const loggedMessage = loggerVerboseSpy.mock.calls.find((call) =>
        call[0].includes('Request body:'),
      )?.[0]

      expect(loggedMessage).toBeDefined()
      expect(loggedMessage).toContain('testuser')
      expect(loggedMessage).toContain('***REDACTED***')
      expect(loggedMessage).not.toContain('secretPassword123')

      // Verify next was called
      expect(mockNext).toHaveBeenCalled()
    })

    it('should mask password in register request while preserving username and email', () => {
      const mockRequest = {
        method: 'POST',
        path: '/auth/register',
        body: {
          username: 'newplayer',
          password: 'myPassword456',
          email: 'player@example.com',
        },
      } as Request

      const mockResponse = {} as Response
      const mockNext = jest.fn()

      middleware.use(mockRequest, mockResponse, mockNext)

      // Verify Logger.verbose was called
      expect(loggerVerboseSpy).toHaveBeenCalled()

      // Get the logged message
      const loggedMessage = loggerVerboseSpy.mock.calls.find((call) =>
        call[0].includes('Request body:'),
      )?.[0]

      expect(loggedMessage).toBeDefined()
      expect(loggedMessage).toContain('newplayer')
      expect(loggedMessage).toContain('player@example.com')
      expect(loggedMessage).toContain('***REDACTED***')
      expect(loggedMessage).not.toContain('myPassword456')

      // Verify next was called
      expect(mockNext).toHaveBeenCalled()
    })

    it('should not modify the original request body', () => {
      const originalBody = {
        username: 'testuser',
        password: 'secretPassword123',
      }

      const mockRequest = {
        method: 'POST',
        path: '/auth/login',
        body: originalBody,
      } as Request

      const mockResponse = {} as Response
      const mockNext = jest.fn()

      middleware.use(mockRequest, mockResponse, mockNext)

      // Verify original body is unchanged
      expect(mockRequest.body.password).toBe('secretPassword123')
      expect(mockRequest.body.username).toBe('testuser')
    })
  })
})
