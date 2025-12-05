<template>
  <div class="game-create-screen">
    <div class="game-create-container">
      <h2>Create New Game</h2>
      <p class="subtitle">Start your adventure by creating a new game</p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleCreateGame" class="game-create-form">
        <div class="form-group">
          <label for="gameName">Game Name</label>
          <input
            id="gameName"
            ref="gameNameInput"
            v-model="gameName"
            type="text"
            placeholder="Enter a name for your game"
            required
            :disabled="isCreating"
            maxlength="100"
          />
        </div>

        <div class="button-group">
          <button 
            type="submit" 
            class="btn-create"
            :disabled="isCreating || !gameName.trim()"
          >
            {{ isCreating ? 'Creating...' : 'Create Game' }}
          </button>
          
          <button 
            type="button"
            @click="handleCancel" 
            class="btn-cancel"
            :disabled="isCreating"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'GameCreateScreen',
  setup() {
    // Inject game state
    const gameState = inject('gameState')

    // Component state
    const gameName = ref('')
    const isCreating = ref(false)
    const errorMessage = ref('')
    const gameNameInput = ref(null)

    /**
     * Handle game creation
     * Requirements 5.3, 5.4 - create game and update state
     */
    const handleCreateGame = async () => {
      errorMessage.value = ''
      
      // Validate input
      if (!gameName.value.trim()) {
        errorMessage.value = 'Please enter a game name'
        return
      }

      isCreating.value = true

      try {
        // Use player.id from state (Requirement 9.2)
        const ownerId = gameState.state.player.id
        
        // Call API service helper method to create game
        const createdGame = await apiService.createGame(gameName.value.trim(), ownerId)
        
        // Update state with created game (Requirement 5.4)
        gameState.setGame(createdGame)

        // Trigger auto-load character after creation (Requirement 5.4)
        await gameState.autoLoadCharacter(apiService, createdGame.id, ownerId)

        // If character was loaded, also try to auto-load battle
        if (gameState.state.character) {
          await gameState.autoLoadBattle(apiService, gameState.state.character.id)
        }

        // Clear temporary screen to trigger state-based routing
        // This will cause the app to navigate to the appropriate screen
        gameState.clearTempScreen()

        // Don't clear form or set isCreating to false on success
        // The component will unmount as we navigate away
      } catch (error) {
        // Only handle errors - clear loading state and show error
        isCreating.value = false
        
        if (error.response) {
          errorMessage.value = error.response.data.message || 'Failed to create game'
        } else if (error.request) {
          errorMessage.value = 'Network error. Please check your connection.'
        } else {
          errorMessage.value = 'An unexpected error occurred. Please try again.'
        }
      }
    }

    /**
     * Handle cancel button
     * Clear temp screen to return to state-based routing
     */
    const handleCancel = () => {
      // Clear temp screen - will navigate to game-select since game is null
      gameState.clearTempScreen()
    }

    // Auto-focus game name field on mount
    onMounted(() => {
      gameNameInput.value?.focus()
    })

    return {
      gameName,
      isCreating,
      errorMessage,
      gameNameInput,
      handleCreateGame,
      handleCancel
    }
  }
}
</script>

<style scoped>
.game-create-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.game-create-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
}

.game-create-container h2 {
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

.game-create-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input {
  padding: 0.875rem;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-create,
.btn-cancel {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-create:active:not(:disabled) {
  transform: translateY(0);
}

.btn-create:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-cancel {
  background: #e1e4e8;
  color: #2c3e50;
}

.btn-cancel:hover:not(:disabled) {
  background: #d1d4d8;
  transform: translateY(-2px);
}

.btn-cancel:active:not(:disabled) {
  transform: translateY(0);
}

.btn-cancel:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .game-create-screen {
    padding: 1rem;
  }

  .game-create-container {
    padding: 2rem 1.5rem;
  }

  .game-create-container h2 {
    font-size: 1.75rem;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
