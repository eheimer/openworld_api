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

  // ========================================
  // Authentication Helper Methods
  // ========================================

  /**
   * Login with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{player: number, token: string}>} Login response with player ID and JWT token
   */
  async login(username, password) {
    const response = await this.post('/auth/login', { username, password })
    
    // Store token and player ID in localStorage
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token)
    }
    if (response.data.player) {
      localStorage.setItem('player_id', response.data.player)
    }
    
    return response.data
  }

  /**
   * Register a new user account
   * @param {string} username - Desired username
   * @param {string} email - Email address
   * @param {string} password - Desired password
   * @returns {Promise<void>} Registration response
   */
  async register(username, email, password) {
    const response = await this.post('/auth/register', { username, email, password })
    return response.data
  }

  // ========================================
  // Game Management Helper Methods
  // ========================================

  /**
   * Get all games for a player
   * Uses the JWT token to identify the player, no playerId needed in URL
   * @returns {Promise<Array>} List of games the player is part of
   */
  async getGames() {
    const response = await this.get('/games')
    return response.data
  }

  /**
   * Create a new game
   * @param {string} name - Game name
   * @param {number} ownerId - Owner's player ID
   * @returns {Promise<Object>} Created game object
   */
  async createGame(name, ownerId) {
    const response = await this.post('/games', { name, ownerId })
    return response.data
  }

  // ========================================
  // Character Management Helper Methods
  // ========================================

  /**
   * Get all characters for a player in a specific game
   * @param {number} gameId - Game ID
   * @param {number} playerId - Player ID
   * @returns {Promise<Array>} List of characters
   */
  async getCharactersByGame(gameId, playerId) {
    const response = await this.get(`/games/${gameId}/characters`, {
      params: { playerId }
    })
    return response.data
  }

  /**
   * Create a new character
   * @param {Object} data - Character data (name, race, skills, gameId, playerId, etc.)
   * @returns {Promise<Object>} Created character object
   */
  async createCharacter(data) {
    const response = await this.post('/games/characters', data)
    return response.data
  }

  // ========================================
  // Battle Management Helper Methods
  // ========================================

  /**
   * Get active battle for a character
   * @param {number} characterId - Character ID
   * @returns {Promise<Object|null>} Active battle object or null if no active battle
   */
  async getActiveBattle(characterId) {
    try {
      const response = await this.get(`/games/characters/${characterId}/battles/active`)
      return response.data
    } catch (error) {
      // If 404, no active battle exists
      if (error.response && error.response.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Create a new battle
   * @param {number} characterId - Character ID
   * @param {number} monsterId - Monster ID
   * @returns {Promise<Object>} Created battle object
   */
  async createBattle(characterId, monsterId) {
    const response = await this.post('/games/battles', { characterId, monsterId })
    return response.data
  }

  /**
   * End a battle
   * @param {number} battleId - Battle ID
   * @returns {Promise<void>} End battle response
   */
  async endBattle(battleId) {
    const response = await this.delete(`/games/battles/${battleId}`)
    return response.data
  }
}

// Export singleton instance
export default new ApiService()
