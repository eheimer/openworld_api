import { reactive, computed, watch } from 'vue'

/**
 * Game State Management Composable
 * Provides centralized state management for the game simulator
 */

const STORAGE_KEY = 'gameState'
const DEBOUNCE_DELAY = 300 // milliseconds

/**
 * Load state from localStorage
 * Requirement 3.7
 */
function loadStateFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate that parsed data has expected structure
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          player: parsed.player || null,
          game: parsed.game || null,
          character: parsed.character || null,
          battle: parsed.battle || null
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load state from localStorage, using empty state:', error)
  }
  // Return empty state if loading fails or no data exists
  return {
    player: null,
    game: null,
    character: null,
    battle: null
  }
}

/**
 * Save state to localStorage with debouncing
 * Requirement 3.6
 */
let saveTimeout = null
function saveStateToStorage(stateToSave) {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  
  // Debounce the save operation
  saveTimeout = setTimeout(() => {
    try {
      const serialized = JSON.stringify(stateToSave)
      localStorage.setItem(STORAGE_KEY, serialized)
    } catch (error) {
      console.error('Failed to save state to localStorage:', error)
    }
  }, DEBOUNCE_DELAY)
}

// Create reactive state object (singleton) - restore from localStorage
const state = reactive({
  ...loadStateFromStorage(),
  tempScreen: null // Temporary screen override for non-state-based screens
})

// Watch for state changes and persist to localStorage
// Don't persist tempScreen as it's only for navigation
watch(
  () => ({
    player: state.player,
    game: state.game,
    character: state.character,
    battle: state.battle
  }),
  (newState) => {
    saveStateToStorage(newState)
  },
  { deep: true }
)

/**
 * useGameState composable
 * Returns state management interface
 */
export function useGameState() {
  /**
   * Computed property for current screen based on state
   * Implements routing logic from Requirements 4.1-4.5
   */
  const currentScreen = computed(() => {
    // Check for temporary screen override first
    if (state.tempScreen) return state.tempScreen
    
    // Normal state-based routing
    if (!state.player) return 'login'
    if (!state.game) return 'game-select'
    if (!state.character) return 'character-create'
    if (!state.battle) return 'character'
    return 'battle'
  })

  /**
   * Computed property for menu options based on state
   * Implements context-sensitive menu from Requirements 8.1-8.4
   */
  const menuOptions = computed(() => {
    const options = []

    // All states null - only login option
    if (!state.player && !state.game && !state.character && !state.battle) {
      options.push({ id: 'login', label: 'Login', icon: '🔑' })
      return options
    }

    // Player exists, others null - logout and select game
    if (state.player && !state.game && !state.character && !state.battle) {
      options.push({ id: 'logout', label: 'Logout', icon: '🚪' })
      options.push({ id: 'select-game', label: 'Select Game', icon: '🎮' })
      return options
    }

    // Player and game exist, character null - logout, select game
    if (state.player && state.game && !state.character && !state.battle) {
      options.push({ id: 'logout', label: 'Logout', icon: '🚪' })
      options.push({ id: 'select-game', label: 'Select Game', icon: '🎮' })
      return options
    }

    // Player, game, and character exist, battle null - logout, select game, character
    if (state.player && state.game && state.character && !state.battle) {
      options.push({ id: 'logout', label: 'Logout', icon: '🚪' })
      options.push({ id: 'select-game', label: 'Select Game', icon: '🎮' })
      options.push({ id: 'character', label: 'Character', icon: '👤' })
      return options
    }

    // All populated - logout, select game, character, leave battle
    if (state.player && state.game && state.character && state.battle) {
      options.push({ id: 'logout', label: 'Logout', icon: '🚪' })
      options.push({ id: 'select-game', label: 'Select Game', icon: '🎮' })
      options.push({ id: 'character', label: 'Character', icon: '👤' })
      options.push({ id: 'leave-battle', label: 'Leave Battle', icon: '⚔️' })
      return options
    }

    return options
  })

  /**
   * Set player in state
   * Requirement 3.2
   */
  const setPlayer = (player) => {
    state.player = player
  }

  /**
   * Set game in state
   * Requirement 3.3
   */
  const setGame = (game) => {
    state.game = game
  }

  /**
   * Set character in state
   * Requirement 3.4
   */
  const setCharacter = (character) => {
    state.character = character
  }

  /**
   * Set battle in state
   * Requirement 3.5
   */
  const setBattle = (battle) => {
    state.battle = battle
  }

  /**
   * Clear all state properties
   */
  const clearState = () => {
    state.player = null
    state.game = null
    state.character = null
    state.battle = null
  }

  /**
   * Logout - clear all state and navigate to login
   * Requirement 8.5
   */
  const logout = () => {
    clearState()
    state.tempScreen = null
    // Clear localStorage tokens
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('player_id')
  }

  /**
   * Navigate to a temporary screen (register, game-create, battle-create)
   */
  const navigateTo = (screenName) => {
    state.tempScreen = screenName
  }

  /**
   * Clear temporary screen and return to state-based routing
   */
  const clearTempScreen = () => {
    state.tempScreen = null
  }

  /**
   * Auto-load character when game is selected
   * Requirements 6.1, 6.2
   * 
   * @param {Object} apiService - The API service instance
   * @param {number} gameId - The game ID
   * @param {number} playerId - The player ID
   */
  const autoLoadCharacter = async (apiService, gameId, playerId) => {
    try {
      // Query API for characters belonging to the player in this game
      const response = await apiService.get(`/games/${gameId}/characters`, {
        params: { playerId }
      })
      
      const characters = response.data
      
      // If character exists, populate state with first character
      if (characters && characters.length > 0) {
        setCharacter(characters[0])
      } else {
        // No character exists, leave as null (will show character-create screen)
        setCharacter(null)
      }
    } catch (error) {
      console.error('Failed to auto-load character:', error)
      // On error, leave character as null
      setCharacter(null)
    }
  }

  /**
   * Auto-load battle when character is loaded
   * Requirement 10.4
   * 
   * @param {Object} apiService - The API service instance
   * @param {number} characterId - The character ID
   */
  const autoLoadBattle = async (apiService, characterId) => {
    try {
      // Query API for active battle for this character
      const response = await apiService.get(`/battles/active/${characterId}`)
      
      const battle = response.data
      
      // If battle exists, populate state
      if (battle) {
        setBattle(battle)
      } else {
        // No active battle, leave as null
        setBattle(null)
      }
    } catch (error) {
      // If 404 or other error, assume no active battle
      console.error('Failed to auto-load battle:', error)
      setBattle(null)
    }
  }

  return {
    state,
    currentScreen,
    menuOptions,
    setPlayer,
    setGame,
    setCharacter,
    setBattle,
    clearState,
    logout,
    navigateTo,
    clearTempScreen,
    autoLoadCharacter,
    autoLoadBattle
  }
}
