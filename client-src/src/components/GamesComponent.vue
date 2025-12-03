<template>
  <div class="games-component">
    <!-- Create Game Form -->
    <div class="form-container">
      <h3>Create New Game</h3>
      <form @submit.prevent="handleCreateGame" class="game-form">
        <div class="form-group">
          <label for="game-name">Game Name</label>
          <input
            id="game-name"
            v-model="createForm.name"
            type="text"
            required
            placeholder="Enter game name"
            :disabled="isLoading"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? 'Creating...' : 'Create Game' }}
        </button>

        <div v-if="createError" class="error-message">
          {{ createError }}
        </div>

        <div v-if="createSuccess" class="success-message">
          Game created successfully!
        </div>
      </form>
    </div>

    <!-- Games List -->
    <div class="games-list-container">
      <h3>My Games</h3>
      <button @click="loadGames" :disabled="isLoading" class="btn-secondary">
        {{ isLoading ? 'Loading...' : 'Refresh Games' }}
      </button>

      <div v-if="gamesError" class="error-message">
        {{ gamesError }}
      </div>

      <div v-if="games.length === 0 && !isLoading" class="empty-message">
        No games found. Create a game to get started!
      </div>

      <div v-if="games.length > 0" class="games-list">
        <div v-for="gameItem in games" :key="gameItem.game.id" class="game-card">
          <div class="game-header">
            <h4>{{ gameItem.game.name }}</h4>
            <span v-if="gameItem.owner" class="owner-badge">Owner</span>
          </div>

          <div class="game-info">
            <p><strong>Game ID:</strong> {{ gameItem.game.id }}</p>
            <p><strong>Owner:</strong> {{ gameItem.game.owner?.username || 'Unknown' }}</p>
            <p v-if="gameItem.character">
              <strong>Your Character:</strong> {{ gameItem.character.name }}
            </p>
          </div>

          <div class="game-actions">
            <button @click="viewGameDetails(gameItem.game.id)" class="btn-secondary">
              View Details
            </button>
            <button 
              v-if="gameItem.owner" 
              @click="selectGameForUpdate(gameItem.game)" 
              class="btn-secondary"
            >
              Update Name
            </button>
            <button 
              v-if="gameItem.owner" 
              @click="deleteGame(gameItem.game.id)" 
              class="btn-danger"
              :disabled="isLoading"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Details -->
    <div v-if="selectedGame" class="game-details-container">
      <h3>Game Details: {{ selectedGame.name }}</h3>
      
      <div class="details-section">
        <h4>Players</h4>
        <div v-if="selectedGame.players && selectedGame.players.length > 0" class="players-list">
          <div v-for="player in selectedGame.players" :key="player.id" class="player-item">
            <span>{{ player.username }} (ID: {{ player.id }})</span>
            <button 
              v-if="isGameOwner(selectedGame)" 
              @click="removePlayerFromGame(selectedGame.id, player.id)"
              class="btn-danger btn-small"
              :disabled="isLoading || player.id === selectedGame.owner?.id"
            >
              Remove
            </button>
          </div>
        </div>
        <p v-else class="empty-message">No players in this game.</p>

        <!-- Add Player Form -->
        <div v-if="isGameOwner(selectedGame)" class="add-player-form">
          <h5>Add Player to Game</h5>
          <form @submit.prevent="addPlayerToGame" class="inline-form">
            <input
              v-model="addPlayerForm.playerId"
              type="number"
              placeholder="Player ID"
              required
              :disabled="isLoading"
            />
            <button type="submit" :disabled="isLoading" class="btn-primary">
              Add Player
            </button>
          </form>
          <div v-if="addPlayerError" class="error-message">
            {{ addPlayerError }}
          </div>
        </div>
      </div>

      <div class="details-section">
        <h4>Characters</h4>
        <div v-if="gameCharacters.length > 0" class="characters-list">
          <div v-for="character in gameCharacters" :key="character.id" class="character-item">
            <span>{{ character.name }} - {{ character.race?.name || 'Unknown Race' }}</span>
          </div>
        </div>
        <p v-else class="empty-message">No characters in this game yet.</p>
      </div>

      <button @click="closeGameDetails" class="btn-secondary">
        Close Details
      </button>
    </div>

    <!-- Update Game Name Modal -->
    <div v-if="updateForm.gameId" class="modal-overlay" @click="cancelUpdate">
      <div class="modal-content" @click.stop>
        <h3>Update Game Name</h3>
        <form @submit.prevent="handleUpdateGame" class="game-form">
          <div class="form-group">
            <label for="update-game-name">New Game Name</label>
            <input
              id="update-game-name"
              v-model="updateForm.name"
              type="text"
              required
              placeholder="Enter new game name"
              :disabled="isLoading"
            />
          </div>

          <div class="modal-actions">
            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? 'Updating...' : 'Update' }}
            </button>
            <button type="button" @click="cancelUpdate" class="btn-secondary">
              Cancel
            </button>
          </div>

          <div v-if="updateError" class="error-message">
            {{ updateError }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'GamesComponent',
  setup() {
    // State
    const games = ref([])
    const selectedGame = ref(null)
    const gameCharacters = ref([])
    const isLoading = ref(false)

    // Create game form
    const createForm = ref({ name: '' })
    const createError = ref('')
    const createSuccess = ref(false)

    // Update game form
    const updateForm = ref({ gameId: null, name: '' })
    const updateError = ref('')

    // Games list error
    const gamesError = ref('')

    // Add player form
    const addPlayerForm = ref({ playerId: '' })
    const addPlayerError = ref('')

    // Get current player ID
    const getCurrentPlayerId = () => {
      return parseInt(localStorage.getItem('player_id'))
    }

    // Check if current player is game owner
    const isGameOwner = (game) => {
      const currentPlayerId = getCurrentPlayerId()
      return game.owner?.id === currentPlayerId
    }

    /**
     * Load all games for the current player
     */
    const loadGames = async () => {
      gamesError.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get('/games')
        games.value = response.data
      } catch (error) {
        if (error.response) {
          gamesError.value = error.response.data.message || 'Failed to load games'
        } else {
          gamesError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Create a new game
     */
    const handleCreateGame = async () => {
      createError.value = ''
      createSuccess.value = false
      isLoading.value = true

      try {
        await apiService.post('/games', {
          name: createForm.value.name
        })

        createSuccess.value = true
        createForm.value.name = ''
        
        // Reload games list
        await loadGames()

        // Clear success message after 3 seconds
        setTimeout(() => {
          createSuccess.value = false
        }, 3000)
      } catch (error) {
        if (error.response) {
          createError.value = error.response.data.message || 'Failed to create game'
        } else {
          createError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * View game details
     */
    const viewGameDetails = async (gameId) => {
      isLoading.value = true
      gamesError.value = ''

      try {
        // Fetch game details
        const gameResponse = await apiService.get(`/games/${gameId}`)
        selectedGame.value = gameResponse.data

        // Fetch characters for this game
        try {
          const charactersResponse = await apiService.get(`/games/${gameId}/characters`)
          gameCharacters.value = charactersResponse.data
        } catch (charError) {
          // Characters endpoint might fail if player is not in game
          gameCharacters.value = []
        }
      } catch (error) {
        if (error.response) {
          gamesError.value = error.response.data.message || 'Failed to load game details'
        } else {
          gamesError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Close game details view
     */
    const closeGameDetails = () => {
      selectedGame.value = null
      gameCharacters.value = []
      addPlayerError.value = ''
      addPlayerForm.value.playerId = ''
    }

    /**
     * Select game for update
     */
    const selectGameForUpdate = (game) => {
      updateForm.value.gameId = game.id
      updateForm.value.name = game.name
      updateError.value = ''
    }

    /**
     * Cancel update
     */
    const cancelUpdate = () => {
      updateForm.value.gameId = null
      updateForm.value.name = ''
      updateError.value = ''
    }

    /**
     * Update game name
     */
    const handleUpdateGame = async () => {
      updateError.value = ''
      isLoading.value = true

      try {
        await apiService.patch(`/games/${updateForm.value.gameId}`, {
          name: updateForm.value.name
        })

        // Reload games list
        await loadGames()

        // Close modal
        cancelUpdate()
      } catch (error) {
        if (error.response) {
          updateError.value = error.response.data.message || 'Failed to update game'
        } else {
          updateError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Delete a game
     */
    const deleteGame = async (gameId) => {
      if (!confirm('Are you sure you want to delete this game?')) {
        return
      }

      isLoading.value = true
      gamesError.value = ''

      try {
        await apiService.delete(`/games/${gameId}`)
        
        // Reload games list
        await loadGames()

        // Close details if this game was selected
        if (selectedGame.value?.id === gameId) {
          closeGameDetails()
        }
      } catch (error) {
        if (error.response) {
          gamesError.value = error.response.data.message || 'Failed to delete game'
        } else {
          gamesError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Add player to game
     */
    const addPlayerToGame = async () => {
      addPlayerError.value = ''
      isLoading.value = true

      try {
        await apiService.post(
          `/games/${selectedGame.value.id}/players/${addPlayerForm.value.playerId}`
        )

        // Reload game details
        await viewGameDetails(selectedGame.value.id)

        // Clear form
        addPlayerForm.value.playerId = ''
      } catch (error) {
        if (error.response) {
          addPlayerError.value = error.response.data.message || 'Failed to add player'
        } else {
          addPlayerError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Remove player from game
     */
    const removePlayerFromGame = async (gameId, playerId) => {
      if (!confirm('Are you sure you want to remove this player from the game?')) {
        return
      }

      isLoading.value = true
      addPlayerError.value = ''

      try {
        await apiService.delete(`/games/${gameId}/players/${playerId}`)

        // Reload game details
        await viewGameDetails(gameId)
      } catch (error) {
        if (error.response) {
          addPlayerError.value = error.response.data.message || 'Failed to remove player'
        } else {
          addPlayerError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    // Load games on component mount
    onMounted(() => {
      loadGames()
    })

    return {
      games,
      selectedGame,
      gameCharacters,
      isLoading,
      createForm,
      createError,
      createSuccess,
      updateForm,
      updateError,
      gamesError,
      addPlayerForm,
      addPlayerError,
      loadGames,
      handleCreateGame,
      viewGameDetails,
      closeGameDetails,
      selectGameForUpdate,
      cancelUpdate,
      handleUpdateGame,
      deleteGame,
      addPlayerToGame,
      removePlayerFromGame,
      isGameOwner
    }
  }
}
</script>

<style scoped>
.games-component {
  max-width: 1400px;
  margin: 0 auto;
}

.form-container,
.games-list-container,
.game-details-container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
  margin-bottom: 2rem;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

h5 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.game-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group input:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
  margin-right: 0.5rem;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
  transform: translateY(-1px);
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-1px);
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Messages */
.error-message {
  padding: 0.75rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.success-message {
  padding: 0.75rem;
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 4px;
  color: #3c3;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.empty-message {
  color: #7f8c8d;
  font-style: italic;
  padding: 1rem;
  text-align: center;
}

/* Games List */
.games-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.game-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.game-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-header h4 {
  margin: 0;
  color: #2c3e50;
}

.owner-badge {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.game-info {
  margin-bottom: 1rem;
}

.game-info p {
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
}

.game-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Game Details */
.details-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 1.5rem;
}

.players-list,
.characters-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.player-item,
.character-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e1e4e8;
}

.add-player-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e4e8;
}

.inline-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.inline-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.inline-form input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .games-list {
    grid-template-columns: 1fr;
  }

  .game-actions {
    flex-direction: column;
  }

  .game-actions button {
    width: 100%;
  }

  .inline-form {
    flex-direction: column;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }
}
</style>
