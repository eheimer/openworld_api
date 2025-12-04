import axios from 'axios'

/**
 * API Service for Openworld Test Client
 * Handles all HTTP requests with authentication and logging
 */
class ApiService {
  constructor() {
    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Store for request/response logs
    this.logs = []
    this.maxLogs = 100
    this.autoCullEnabled = true

    // Setup interceptors
    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  /**
   * Request interceptor to inject JWT token from localStorage
   */
  setupRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('jwt_token')
        
        // Inject token into Authorization header if it exists
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log the request
        this.logRequest(config)

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * Response interceptor to handle 401 errors and log responses
   */
  setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response
        this.logResponse(response)
        return response
      },
      (error) => {
        // Log error response
        if (error.response) {
          this.logResponse(error.response, true)
        }

        // Handle 401 Unauthorized - clear token and redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('jwt_token')
          localStorage.removeItem('player_id')
          // Emit event for components to handle
          window.dispatchEvent(new CustomEvent('auth:logout'))
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Log API request
   */
  logRequest(config) {
    const log = {
      timestamp: new Date(),
      type: 'request',
      method: config.method.toUpperCase(),
      endpoint: config.url,
      payload: config.data,
      headers: config.headers
    }

    this.addLog(log)
  }

  /**
   * Log API response
   */
  logResponse(response, isError = false) {
    const log = {
      timestamp: new Date(),
      type: 'response',
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: response.data,
      isError
    }

    this.addLog(log)
  }

  /**
   * Add log entry and maintain max log size
   */
  addLog(log) {
    this.logs.push(log)
    if (this.autoCullEnabled && this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
    // Emit event for components to update
    window.dispatchEvent(new CustomEvent('api:log', { detail: log }))
  }

  /**
   * Get all logs
   */
  getLogs() {
    return this.logs
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * Set auto-cull behavior
   */
  setAutoCull(enabled) {
    this.autoCullEnabled = enabled
  }

  /**
   * Helper method for GET requests
   */
  async get(endpoint, config = {}) {
    return this.client.get(endpoint, config)
  }

  /**
   * Helper method for POST requests
   */
  async post(endpoint, data = {}, config = {}) {
    return this.client.post(endpoint, data, config)
  }

  /**
   * Helper method for PUT requests
   */
  async put(endpoint, data = {}, config = {}) {
    return this.client.put(endpoint, data, config)
  }

  /**
   * Helper method for DELETE requests
   */
  async delete(endpoint, config = {}) {
    return this.client.delete(endpoint, config)
  }

  /**
   * Helper method for PATCH requests
   */
  async patch(endpoint, data = {}, config = {}) {
    return this.client.patch(endpoint, data, config)
  }
}

// Export singleton instance
export default new ApiService()
