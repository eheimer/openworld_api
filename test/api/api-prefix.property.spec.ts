import { INestApplication } from '@nestjs/common'
import * as fc from 'fast-check'
import { APIUtils } from './helpers/util'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Property-Based Tests for API Path Prefix Feature
 * 
 * These tests verify that the /api prefix is correctly applied to all routes
 * and that authentication/authorization behavior is preserved.
 */

describe('API Prefix Property-Based Tests', () => {
  let app: INestApplication
  let openApiSpec: any
  let validEndpoints: Array<{ path: string; method: string; requiresAuth: boolean }>

  beforeAll(async () => {
    app = await APIUtils.createApp()

    // Load OpenAPI spec to get valid endpoints
    const specPath = path.join(__dirname, '../../dist/openapi.json')
    if (fs.existsSync(specPath)) {
      openApiSpec = JSON.parse(fs.readFileSync(specPath, 'utf-8'))
      validEndpoints = extractEndpointsFromSpec(openApiSpec)
    } else {
      // Fallback: define a minimal set of known endpoints for testing
      validEndpoints = [
        { path: '/auth/login', method: 'post', requiresAuth: false },
        { path: '/auth/register', method: 'post', requiresAuth: false },
        { path: '/games', method: 'get', requiresAuth: true },
        { path: '/games', method: 'post', requiresAuth: true },
        { path: '/monsters', method: 'get', requiresAuth: true },
        { path: '/race', method: 'get', requiresAuth: true },
        { path: '/damage-types', method: 'get', requiresAuth: true },
        { path: '/conditions', method: 'get', requiresAuth: true }
      ]
    }
  })

  afterAll(async () => {
    await app.close()
  })

  /**
   * **Feature: api-path-prefix, Property 1: Prefixed routes are accessible**
   * **Validates: Requirements 1.2**
   * 
   * For any valid API endpoint path, when a request is made to /api/{endpoint},
   * the system should route the request successfully and return a non-404 response.
   */
  describe('Property 1: Prefixed routes are accessible', () => {
    it('should access all prefixed routes without 404 errors', async () => {
      // Create a test player with auth token for protected endpoints
      const { token } = await APIUtils.registerAndLoginPlayer(app)

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...validEndpoints),
          async (endpoint) => {
            const response = endpoint.requiresAuth
              ? await APIUtils.buildAuthorizedRequest(app, endpoint.method, endpoint.path, token)
              : await APIUtils.buildRequest(app, endpoint.method, endpoint.path)

            // The response should not be 404 - it may be 200, 201, 400, 401, 403, etc.
            // but the route should exist
            expect(response.status).not.toBe(404)
          }
        ),
        { numRuns: 100 }
      )
    }, 60000) // Increased timeout for property-based test
  })

  /**
   * **Feature: api-path-prefix, Property 2: Unprefixed routes return 404**
   * **Validates: Requirements 1.3**
   * 
   * For any valid API endpoint path, when a request is made to /{endpoint}
   * (without the /api prefix), the system should return a 404 Not Found response.
   */
  describe('Property 2: Unprefixed routes return 404', () => {
    it('should return 404 for all unprefixed routes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...validEndpoints),
          async (endpoint) => {
            // Make request directly to the HTTP server without using APIUtils
            // to bypass the automatic /api prefix
            const request = require('supertest')
            const response = await request(app.getHttpServer())[endpoint.method](endpoint.path)

            // All unprefixed routes should return 404
            expect(response.status).toBe(404)
          }
        ),
        { numRuns: 100 }
      )
    }, 60000)
  })

  /**
   * **Feature: api-path-prefix, Property 3: Authentication and authorization preserved**
   * **Validates: Requirements 1.5**
   * 
   * For any protected endpoint, when accessed with the /api prefix, the system should
   * enforce the same authentication and authorization rules as before the prefix change.
   */
  describe('Property 3: Authentication and authorization preserved', () => {
    it('should enforce authentication on protected endpoints with prefix', async () => {
      const { token } = await APIUtils.registerAndLoginPlayer(app)
      const protectedEndpoints = validEndpoints.filter((e) => e.requiresAuth)

      // Skip test if no protected endpoints are found
      if (protectedEndpoints.length === 0) {
        console.warn('No protected endpoints found in OpenAPI spec, skipping Property 3')
        return
      }

      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(...protectedEndpoints),
          fc.constantFrom('valid', 'invalid', 'none'),
          async (endpoint, authType) => {
            let response

            switch (authType) {
              case 'valid':
                // With valid token, should not get 401
                response = await APIUtils.buildAuthorizedRequest(app, endpoint.method, endpoint.path, token)
                expect(response.status).not.toBe(401)
                break

              case 'invalid':
                // With invalid token, should get 401
                response = await APIUtils.buildAuthorizedRequest(
                  app,
                  endpoint.method,
                  endpoint.path,
                  'invalid-token'
                )
                expect(response.status).toBe(401)
                break

              case 'none':
                // With no token, should get 401
                response = await APIUtils.buildRequest(app, endpoint.method, endpoint.path)
                expect(response.status).toBe(401)
                break
            }
          }
        ),
        { numRuns: 100 }
      )
    }, 60000)
  })
})

/**
 * Helper function to extract endpoints from OpenAPI specification
 */
function extractEndpointsFromSpec(spec: any): Array<{ path: string; method: string; requiresAuth: boolean }> {
  const endpoints: Array<{ path: string; method: string; requiresAuth: boolean }> = []

  for (const path in spec.paths) {
    const pathItem = spec.paths[path]
    for (const method in pathItem) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        const operation = pathItem[method]
        // Check if endpoint requires authentication by looking for security requirements
        const requiresAuth = operation.security && operation.security.length > 0

        // Skip endpoints with path parameters for simplicity in property testing
        if (!path.includes('{')) {
          // Remove /api prefix from OpenAPI spec paths since APIUtils will add it
          const pathWithoutPrefix = path.startsWith('/api') ? path.substring(4) : path
          endpoints.push({
            path: pathWithoutPrefix,
            method,
            requiresAuth: requiresAuth || false
          })
        }
      }
    }
  }

  return endpoints
}
