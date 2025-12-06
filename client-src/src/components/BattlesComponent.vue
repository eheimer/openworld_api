<template>
  <div class="battles-component">
    <!-- Game Selection -->
    <div class="form-container">
      <h3>Select Game</h3>
      <div class="form-group">
        <label for="game-select">Choose a game to manage battles</label>
        <select
          id="game-select"
          v-model="selectedGameId"
          @change="onGameChange"
          :disabled="isLoading || games.length === 0"
        >
          <option :value="null">-- Select a game --</option>
          <option v-for="gameItem in games" :key="gameItem.game.id" :value="gameItem.game.id">
            {{ gameItem.game.name }} (ID: {{ gameItem.game.id }})
          </option>
        </select>
      </div>

      <button @click="loadGames" :disabled="isLoading" class="btn-secondary">
        {{ isLoading ? 'Loading...' : 'Refresh Games' }}
      </button>

      <div v-if="gamesError" class="error-message">
        {{ gamesError }}
      </div>
    </div>

    <!-- Create Battle -->
    <div v-if="selectedGameId" class="form-container">
      <h3>Create New Battle</h3>
      <button @click="handleCreateBattle" :disabled="isLoading" class="btn-primary">
        {{ isLoading ? 'Creating...' : 'Create Battle' }}
      </button>

      <div v-if="createError" class="error-message">
        {{ createError }}
      </div>

      <div v-if="createSuccess" class="success-message">
        Battle created successfully!
      </div>
    </div>

    <!-- Battles List -->
    <div v-if="selectedGameId" class="battles-list-container">
      <h3>Battles in Game</h3>
      <button @click="loadBattles" :disabled="isLoading" class="btn-secondary">
        {{ isLoading ? 'Loading...' : 'Refresh Battles' }}
      </button>

      <div v-if="battlesError" class="error-message">
        {{ battlesError }}
      </div>

      <div v-if="battles.length === 0 && !isLoading" class="empty-message">
        No battles found in this game. Create a battle to get started!
      </div>

      <div v-if="battles.length > 0" class="battles-list">
        <div v-for="battle in battles" :key="battle.id" class="battle-card">
          <div class="battle-header">
            <h4>Battle {{ battle.id }}</h4>
            <span class="round-badge">Round {{ battle.round }}</span>
          </div>

          <div class="battle-info">
            <p><strong>Battle ID:</strong> {{ battle.id }}</p>
            <p><strong>Initiator:</strong> Player {{ battle.initiator }}</p>
            <p><strong>Participants:</strong> {{ battle.participants?.length || 0 }}</p>
            <p><strong>Enemies:</strong> {{ battle.enemies?.length || 0 }}</p>
          </div>

          <div class="battle-actions">
            <button @click="viewBattleDetails(battle.id)" class="btn-secondary">
              View Details
            </button>
            <button 
              @click="joinBattle(battle.id)" 
              class="btn-primary"
              :disabled="isLoading"
            >
              Join Battle
            </button>
            <button 
              @click="deleteBattle(battle.id)" 
              class="btn-danger"
              :disabled="isLoading"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Battle Details Modal -->
    <div v-if="selectedBattle" class="modal-overlay" @click="closeBattleDetails">
      <div class="modal-content" @click.stop>
        <h3>Battle {{ selectedBattle.id }} - Round {{ selectedBattle.round }}</h3>
        
        <div class="details-section">
          <h4>Battle Information</h4>
          <p><strong>Initiator:</strong> Player {{ selectedBattle.initiator }}</p>
          <p><strong>Current Round:</strong> {{ selectedBattle.round }}</p>
        </div>

        <div class="details-section">
          <h4>Participants</h4>
          <div v-if="selectedBattle.participants && selectedBattle.participants.length > 0" class="participants-list">
            <div v-for="participant in selectedBattle.participants" :key="participant.id" class="participant-item">
              <span>{{ participant.name }} ({{ participant.raceName }})</span>
            </div>
          </div>
          <p v-else class="empty-message">No participants in this battle yet.</p>
        </div>

        <div class="details-section">
          <h4>Enemies</h4>
          <div v-if="selectedBattle.enemies && selectedBattle.enemies.length > 0" class="enemies-list">
            <div v-for="enemy in selectedBattle.enemies" :key="enemy.monsterId" class="enemy-item">
              <img 
                :src="getMonsterImageUrl(enemy.name)" 
                :alt="enemy.name"
                class="monster-image"
              />
              <div class="enemy-details">
                <div class="enemy-header">
                  <span class="enemy-name">{{ enemy.name }}</span>
                  <span class="enemy-hp">HP: {{ Math.round(enemy.hp * 100) }}%</span>
                </div>
                <div class="enemy-action">
                  <span><strong>Next Action:</strong> {{ enemy.actionName }}</span>
                  <span v-if="enemy.actionValue"><strong>Value:</strong> {{ enemy.actionValue }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="empty-message">No enemies in this battle yet.</p>

          <!-- Add Monster Form -->
          <div class="add-monster-form">
            <h5>Add Monster to Battle</h5>
            <form @submit.prevent="addMonsterToBattle" class="inline-form">
              <select
                v-model="addMonsterForm.monsterId"
                required
                :disabled="isLoading || availableMonsters.length === 0"
              >
                <option :value="null">-- Select a monster --</option>
                <option v-for="monster in availableMonsters" :key="monster.id" :value="monster.id">
                  {{ monster.name }}
                </option>
              </select>
              <button type="submit" :disabled="isLoading || !addMonsterForm.monsterId" class="btn-primary">
                Add Monster
              </button>
            </form>
            <div v-if="addMonsterError" class="error-message">
              {{ addMonsterError }}
            </div>
          </div>
        </div>

        <div class="battle-controls">
          <button 
            @click="advanceBattleRound" 
            :disabled="isLoading"
            class="btn-primary btn-large"
          >
            {{ isLoading ? 'Processing...' : 'Advance to Next Round' }}
          </button>
          <div v-if="advanceError" class="error-message">
            {{ advanceError }}
          </div>
        </div>

        <button @click="closeBattleDetails" class="btn-secondary">
          Close Details
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'BattlesComponent',
  setup() {
    // State
    const games = ref([])
    const selectedGameId = ref(null)
    const battles = ref([])
    const selectedBattle = ref(null)
    const availableMonsters = ref([])
    const isLoading = ref(false)

    // Create battle
    const createError = ref('')
    const createSuccess = ref(false)

    // Errors
    const gamesError = ref('')
    const battlesError = ref('')
    const addMonsterError = ref('')
    const advanceError = ref('')

    // Add monster form
    const addMonsterForm = ref({ monsterId: null })

    /**
     * Generate monster image URL from monster name
     */
    const getMonsterImageUrl = (monsterName) => {
      // Remove all non-alpha characters and convert to lowercase
      const filename = monsterName.replace(/[^a-zA-Z]/g, '').toLowerCase() + '.png'
      return `/images/monsters/${filename}`
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
     * Load available monsters
     */
    const loadMonsters = async () => {
      try {
        const response = await apiService.get('/monsters')
        availableMonsters.value = response.data
      } catch (error) {
        console.error('Failed to load monsters:', error)
      }
    }

    /**
     * Handle game selection change
     */
    const onGameChange = () => {
      battles.value = []
      selectedBattle.value = null
      battlesError.value = ''
      
      if (selectedGameId.value) {
        loadBattles()
      }
    }

    /**
     * Load battles for selected game
     */
    const loadBattles = async () => {
      if (!selectedGameId.value) return

      battlesError.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get(`/games/${selectedGameId.value}/battles`)
        battles.value = response.data
      } catch (error) {
        if (error.response) {
          battlesError.value = error.response.data.message || 'Failed to load battles'
        } else {
          battlesError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Create a new battle
     */
    const handleCreateBattle = async () => {
      createError.value = ''
      createSuccess.value = false
      isLoading.value = true

      try {
        await apiService.post(`/games/${selectedGameId.value}/battles`)

        createSuccess.value = true
        
        // Reload battles list
        await loadBattles()

        // Clear success message after 3 seconds
        setTimeout(() => {
          createSuccess.value = false
        }, 3000)
      } catch (error) {
        if (error.response) {
          createError.value = error.response.data.message || 'Failed to create battle'
        } else {
          createError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * View battle details
     */
    const viewBattleDetails = async (battleId) => {
      isLoading.value = true
      battlesError.value = ''
      addMonsterError.value = ''
      advanceError.value = ''

      try {
        const response = await apiService.get(`/games/${selectedGameId.value}/battles/${battleId}`)
        selectedBattle.value = response.data
        addMonsterForm.value.monsterId = null
      } catch (error) {
        if (error.response) {
          battlesError.value = error.response.data.message || 'Failed to load battle details'
        } else {
          battlesError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Close battle details modal
     */
    const closeBattleDetails = () => {
      selectedBattle.value = null
      addMonsterError.value = ''
      advanceError.value = ''
      addMonsterForm.value.monsterId = null
    }

    /**
     * Join a battle
     */
    const joinBattle = async (battleId) => {
      isLoading.value = true
      battlesError.value = ''

      try {
        await apiService.post(`/games/${selectedGameId.value}/battles/${battleId}/join`)
        
        // Reload battles list
        await loadBattles()

        // If battle details are open, refresh them
        if (selectedBattle.value?.id === battleId) {
          await viewBattleDetails(battleId)
        }
      } catch (error) {
        if (error.response) {
          battlesError.value = error.response.data.message || 'Failed to join battle'
        } else {
          battlesError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Add monster to battle
     */
    const addMonsterToBattle = async () => {
      addMonsterError.value = ''
      isLoading.value = true

      try {
        await apiService.post(
          `/games/${selectedGameId.value}/battles/${selectedBattle.value.id}/enemies`,
          { monsterId: addMonsterForm.value.monsterId }
        )

        // Reload battle details
        await viewBattleDetails(selectedBattle.value.id)

        // Clear form
        addMonsterForm.value.monsterId = null
      } catch (error) {
        if (error.response) {
          addMonsterError.value = error.response.data.message || 'Failed to add monster'
        } else {
          addMonsterError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Advance battle round
     */
    const advanceBattleRound = async () => {
      advanceError.value = ''
      isLoading.value = true

      try {
        await apiService.post(
          `/games/${selectedGameId.value}/battles/${selectedBattle.value.id}/nextround`
        )

        // Reload battle details
        await viewBattleDetails(selectedBattle.value.id)
      } catch (error) {
        if (error.response) {
          advanceError.value = error.response.data.message || 'Failed to advance battle round'
        } else {
          advanceError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Delete a battle
     */
    const deleteBattle = async (battleId) => {
      if (!confirm('Are you sure you want to delete this battle?')) {
        return
      }

      isLoading.value = true
      battlesError.value = ''

      try {
        await apiService.delete(`/games/${selectedGameId.value}/battles/${battleId}`)
        
        // Reload battles list
        await loadBattles()

        // Close details if this battle was selected
        if (selectedBattle.value?.id === battleId) {
          closeBattleDetails()
        }
      } catch (error) {
        if (error.response) {
          battlesError.value = error.response.data.message || 'Failed to delete battle'
        } else {
          battlesError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    // Load initial data on component mount
    onMounted(() => {
      loadGames()
      loadMonsters()
    })

    return {
      games,
      selectedGameId,
      battles,
      selectedBattle,
      availableMonsters,
      isLoading,
      createError,
      createSuccess,
      gamesError,
      battlesError,
      addMonsterError,
      advanceError,
      addMonsterForm,
      loadGames,
      onGameChange,
      loadBattles,
      handleCreateBattle,
      viewBattleDetails,
      closeBattleDetails,
      joinBattle,
      addMonsterToBattle,
      advanceBattleRound,
      deleteBattle,
      getMonsterImageUrl,
      Math
    }
  }
}
</script>

<style scoped>
.battles-component {
  max-width: 1400px;
  margin: 0 auto;
}

.form-container,
.battles-list-container {
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group select:disabled {
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

.btn-large {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
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

/* Battles List */
.battles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.battle-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.battle-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.battle-header h4 {
  margin: 0;
  color: #2c3e50;
}

.round-badge {
  background: #e67e22;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.battle-info {
  margin-bottom: 1rem;
}

.battle-info p {
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
}

.battle-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Battle Details Modal */
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
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.details-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
  margin-bottom: 1.5rem;
}

.details-section p {
  margin: 0.5rem 0;
  color: #555;
}

.participants-list,
.enemies-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.participant-item {
  padding: 0.75rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e1e4e8;
  color: #2c3e50;
}

.enemy-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e1e4e8;
}

.monster-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  flex-shrink: 0;
}

.enemy-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.enemy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.enemy-name {
  font-weight: 600;
  color: #e74c3c;
  font-size: 1.05rem;
}

.enemy-hp {
  background: #27ae60;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.enemy-action {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #555;
  font-size: 0.9rem;
}

.add-monster-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e4e8;
}

.inline-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.inline-form select {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.inline-form select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.battle-controls {
  margin-bottom: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .battles-list {
    grid-template-columns: 1fr;
  }

  .battle-actions {
    flex-direction: column;
  }

  .battle-actions button {
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
