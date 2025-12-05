<template>
  <div class="game-select-screen">
    <div class="game-select-container">
      <h2>Select a Game</h2>
      <p class="subtitle">Choose a game to continue your adventure</p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="loading-message">
        Loading games...
      </div>

      <div v-else-if="games.length === 0" class="empty-state">
        <p>You don't have any games yet.</p>
        <p>Create your first game to get started!</p>
      </div>

      <div v-else class="games-list">
        <div 
          v-for="gameItem in games" 
          :key="gameItem.game.id" 
          class="game-card"
          @click="handleGameSelection(gameItem.game)"
        >
          <div class="game-header">
            <h3>{{ gameItem.game.name }}</h3>
            <span v-if="gameItem.owner" class="owner-badge">Owner</span>
          </div>
          
          <div class="game-info">
            <p><strong>Game ID:</strong> {{ gameItem.game.id }}</p>
            <p><strong>Owner:</strong> {{ gameItem.game.owner?.username || 'Unknown' }}</p>
            <p v-if="gameItem.character">
              <strong>Your Character:</strong> {{ gameItem.character.name }}
            </p>
          </div>
        </div>
      </div>

      <button 
        @click="navigateToCreateGame" 
        class="btn-create-game"
        :disabled="isLoading"
      >
        + Create New Game
      </button>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'GameSelectScreen',
  setup() {
    // Inject game state
    const gameState = inject('gameState')

    // Component state
    const games = ref([])
    const isLoading = ref(false)
    const errorMessage = ref('')

    /**
     * Load games for the current player
     * Requirement 5.1 - display list of available games
     */
    const loadGames = async () => {
      errorMessage.value = ''
      isLoading.value = true

      try {
        // Call API service helper method
        // The API uses JWT token to identify the player, no need to pass playerId
        const gamesData = await apiService.getGames()
        games.value = gamesData
      } catch (error) {
        // Handle 404 as "no games" rather than an error
        if (error.response && error.response.status === 404) {
          games.value = []
          // Don't show error message for 404 - just show empty state
        } else if (error.response) {
          errorMessage.value = error.response.data.message || 'Failed to load games'
        } else if (error.request) {
          errorMessage.value = 'Network error. Please check your connection.'
        } else {
          errorMessage.value = 'An unexpected error occurred. Please try again.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Handle game selection
     * Requirements 5.2, 6.1, 6.2 - select game and auto-load character
     */
    const handleGameSelection = async (game) => {
      errorMessage.value = ''

      try {
        // Update state with selected game (Requirement 3.3)
        gameState.setGame(game)

        // Trigger auto-load character (Requirements 6.1, 6.2)
        await gameState.autoLoadCharacter(apiService, game.id, gameState.state.player.id)

        // If character was loaded, also try to auto-load battle (Requirement 10.4)
        if (gameState.state.character) {
          await gameState.autoLoadBattle(apiService, gameState.state.character.id)
        }
      } catch (error) {
        errorMessage.value = 'Failed to load game data. Please try again.'
        console.error('Game selection error:', error)
      }
    }

    /**
     * Navigate to game creation screen
     * Requirement 5.3 - provide create game button
     */
    const navigateToCreateGame = () => {
      // Emit event to show game create screen
      window.dispatchEvent(new CustomEvent('navigate:game-create'))
    }

    // Load games on component mount
    onMounted(() => {
      loadGames()
    })

    return {
      games,
      isLoading,
      errorMessage,
      handleGameSelection,
      navigateToCreateGame
    }
  }
}
</script>

<style scoped>
.game-select-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.game-select-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.game-select-container h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  text-align: center;
}

.subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.error-message {
  padding: 0.875rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #7f8c8d;
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.games-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.game-card {
  background: #f8f9fa;
  border: 2px solid #e1e4e8;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.game-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.owner-badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.game-info p {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
}

.game-info strong {
  color: #2c3e50;
}

.btn-create-game {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-create-game:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-create-game:active:not(:disabled) {
  transform: translateY(0);
}

.btn-create-game:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .game-select-screen {
    padding: 1rem;
  }

  .game-select-container {
    padding: 2rem 1.5rem;
  }

  .game-select-container h2 {
    font-size: 1.75rem;
  }

  .games-list {
    grid-template-columns: 1fr;
  }
}
</style>
