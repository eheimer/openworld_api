import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import apiService from './apiService.js'

describe('ApiService', () => {
  let mock

  beforeEach(() => {
    // Create a new mock adapter for axios
    mock = new MockAdapter(apiService.client)
    
    // Clear localStorage
    localStorage.clear()
    
    // Clear logs
    apiService.clearLogs()
  })

  afterEach(() => {
    mock.restore()
  })

  describe('Token Injection', () => {
    it('should inject JWT token from localStorage into request headers', async () => {
      const token = 'test-jwt-token'
      localStorage.setItem('jwt_token', token)

      mock.onGet('/test').reply((config) => {
        expect(config.headers.Authorization).toBe(`Bearer ${token}`)
        return [200, { success: true }]
      })

      await apiService.get('/test')
    })

    it('should not add Authorization header when no token exists', async () => {
      mock.onGet('/test').reply((config) => {
        expect(config.headers.Authorization).toBeUndefined()
        return [200, { success: true }]
      })

      await apiService.get('/test')
    })
  })

  describe('Error Response Handling', () => {
    it('should clear token and dispatch logout event on 401 error', async () => {
      localStorage.setItem('jwt_token', 'test-token')
      localStorage.setItem('player_id', '123')

      const logoutHandler = vi.fn()
      window.addEventListener('auth:logout', logoutHandler)

      mock.onGet('/protected').reply(401, { message: 'Unauthorized' })

      try {
        await apiService.get('/protected')
      } catch (error) {
        // Expected to throw
      }

      expect(localStorage.getItem('jwt_token')).toBeNull()
      expect(localStorage.getItem('player_id')).toBeNull()
      expect(logoutHandler).toHaveBeenCalled()

      window.removeEventListener('auth:logout', logoutHandler)
    })

    it('should not clear token on non-401 errors', async () => {
      localStorage.setItem('jwt_token', 'test-token')

      mock.onGet('/error').reply(500, { message: 'Server error' })

      try {
        await apiService.get('/error')
      } catch (error) {
        // Expected to throw
      }

      expect(localStorage.getItem('jwt_token')).toBe('test-token')
    })
  })

  describe('Request/Response Logging', () => {
    it('should log successful requests and responses', async () => {
      mock.onPost('/test', { data: 'test' }).reply(200, { result: 'success' })

      await apiService.post('/test', { data: 'test' })

      const logs = apiService.getLogs()
      expect(logs.length).toBe(2) // Request and response

      const requestLog = logs.find(log => log.type === 'request')
      expect(requestLog).toBeDefined()
      expect(requestLog.method).toBe('POST')
      expect(requestLog.endpoint).toBe('/test')
      expect(requestLog.payload).toEqual({ data: 'test' })

      const responseLog = logs.find(log => log.type === 'response')
      expect(responseLog).toBeDefined()
      expect(responseLog.status).toBe(200)
      expect(responseLog.body).toEqual({ result: 'success' })
      expect(responseLog.isError).toBe(false)
    })

    it('should log error responses', async () => {
      mock.onGet('/error').reply(404, { message: 'Not found' })

      try {
        await apiService.get('/error')
      } catch (error) {
        // Expected to throw
      }

      const logs = apiService.getLogs()
      const responseLog = logs.find(log => log.type === 'response')
      
      expect(responseLog).toBeDefined()
      expect(responseLog.status).toBe(404)
      expect(responseLog.isError).toBe(true)
    })

    it('should emit api:log event when logging', async () => {
      const logHandler = vi.fn()
      window.addEventListener('api:log', logHandler)

      mock.onGet('/test').reply(200, { data: 'test' })

      await apiService.get('/test')

      expect(logHandler).toHaveBeenCalled()

      window.removeEventListener('api:log', logHandler)
    })

    it('should maintain maximum of 20 logs', async () => {
      mock.onGet(/.*/).reply(200, { data: 'test' })

      // Make 25 requests
      for (let i = 0; i < 25; i++) {
        await apiService.get(`/test${i}`)
      }

      const logs = apiService.getLogs()
      expect(logs.length).toBeLessThanOrEqual(20)
    })
  })

  describe('HTTP Helper Methods', () => {
    it('should perform GET requests', async () => {
      mock.onGet('/users').reply(200, [{ id: 1, name: 'User' }])

      const response = await apiService.get('/users')
      expect(response.status).toBe(200)
      expect(response.data).toEqual([{ id: 1, name: 'User' }])
    })

    it('should perform POST requests', async () => {
      const postData = { name: 'New User' }
      mock.onPost('/users', postData).reply(201, { id: 1, ...postData })

      const response = await apiService.post('/users', postData)
      expect(response.status).toBe(201)
      expect(response.data.name).toBe('New User')
    })

    it('should perform PUT requests', async () => {
      const putData = { name: 'Updated User' }
      mock.onPut('/users/1', putData).reply(200, { id: 1, ...putData })

      const response = await apiService.put('/users/1', putData)
      expect(response.status).toBe(200)
      expect(response.data.name).toBe('Updated User')
    })

    it('should perform DELETE requests', async () => {
      mock.onDelete('/users/1').reply(204)

      const response = await apiService.delete('/users/1')
      expect(response.status).toBe(204)
    })

    it('should perform PATCH requests', async () => {
      const patchData = { name: 'Patched User' }
      mock.onPatch('/users/1', patchData).reply(200, { id: 1, ...patchData })

      const response = await apiService.patch('/users/1', patchData)
      expect(response.status).toBe(200)
      expect(response.data.name).toBe('Patched User')
    })
  })
})
