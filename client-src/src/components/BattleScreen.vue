<template>
  <div class="battle-screen">
    <div class="battle-header">
      <h2>Battle {{ state.battle.id }} - Round {{ battleDetails?.round || 1 }}</h2>
      <button @click="handleEndBattle" class="btn-danger" :disabled="isLoading">
        {{ isLoading ? 'Ending...' : 'End Battle' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="success" class="success-message">
      {{ success }}
    </div>

    <!-- Battle Details -->
    <div v-if="battleDetails" class="battle-container">
      <div class="details-section">
        <h3>Battle Information</h3>
        <p><strong>Battle ID:</strong> {{ battleDetails.id }}</p>
        <p><strong>Character:</strong> {{ state.character.name }}</p>
        <p><strong>Current Round:</strong> {{ battleDetails.round }}</p>
      </div>

      <!-- Participants Section -->
      <div class="details-section">
        <h3>Participants</h3>
        <div v-if="battleDetails.participants && battleDetails.participants.length > 0" class="participants-list">
          <div v-for="participant in battleDetails.participants" :key="participant.id" class="participant-item">
            <span>{{ participant.name }} ({{ participant.raceName }})</span>
          </div>
        </div>
        <p v-else class="empty-message">No participants in this battle yet.</p>
      </div>

      <!-- Enemies Section -->
      <div class="details-section">
        <h3>Enemies</h3>
        <div v-if="battleDetails.enemies && battleDetails.enemies.length > 0" class="enemies-list">
          <div v-for="enemy in battleDetails.enemies" :key="enemy.monsterId" class="enemy-item">
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
          <h4>Add Monster to Battle</h4>
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

      <!-- Battle Controls -->
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
    </div>

    <div v-else-if="!isLoading" class="empty-message">
      Loading battle details...
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'BattleScreen',
  setup() {
    // Inject game state
    const { state, setBattle } = inject('gameState')

    // Component state
    const battleDetails = ref(null)
    const availableMonsters = ref([])
    const isLoading = ref(false)
    const error = ref('')
    const success = ref('')
    const addMonsterError = ref('')
    const advanceError = ref('')
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
     * Load battle details
     * Uses state.game.id, state.battle.id from state
     */
    const loadBattleDetails = async () => {
      if (!state.game || !state.battle) {
        error.value = 'Missing game or battle information'
        return
      }

      isLoading.value = true
      error.value = ''

      try {
        const response = await apiService.get(`/games/${state.game.id}/battles/${state.battle.id}`)
        battleDetails.value = response.data
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to load battle details'
        } else {
          error.value = 'Network error. Please check your connection.'
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
      } catch (err) {
        console.error('Failed to load monsters:', err)
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
          `/games/${state.game.id}/battles/${state.battle.id}/enemies`,
          { monsterId: addMonsterForm.value.monsterId }
        )

        // Reload battle details
        await loadBattleDetails()

        // Clear form
        addMonsterForm.value.monsterId = null
      } catch (err) {
        if (err.response) {
          addMonsterError.value = err.response.data.message || 'Failed to add monster'
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
          `/games/${state.game.id}/battles/${state.battle.id}/nextround`
        )

        // Reload battle details
        await loadBattleDetails()
      } catch (err) {
        if (err.response) {
          advanceError.value = err.response.data.message || 'Failed to advance battle round'
        } else {
          advanceError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Handle battle end
     * Requirement 10.3: Clear battle property from state when battle ends
     */
    const handleEndBattle = async () => {
      if (!confirm('Are you sure you want to end this battle?')) {
        return
      }

      isLoading.value = true
      error.value = ''
      success.value = ''

      try {
        await apiService.delete(`/games/${state.game.id}/battles/${state.battle.id}`)
        
        success.value = 'Battle ended successfully!'
        
        // Clear battle from state (Requirement 10.3)
        setBattle(null)
        
        // Note: The screen will automatically change to CharacterScreen
        // because currentScreen computed property will re-evaluate
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to end battle'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    // Load initial data on component mount
    onMounted(() => {
      loadBattleDetails()
      loadMonsters()
    })

    return {
      state,
      battleDetails,
      availableMonsters,
      isLoading,
      error,
      success,
      addMonsterError,
      advanceError,
      addMonsterForm,
      loadBattleDetails,
      addMonsterToBattle,
      advanceBattleRound,
      handleEndBattle,
      getMonsterImageUrl,
      Math
    }
  }
}
</script>

<style scoped>
.battle-screen {
  max-width: 1200px;
  margin: 0 auto;
}

.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #3498db;
}

.battle-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.75rem;
}

.battle-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.details-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
}

.details-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 0.5rem;
}

.details-section h4 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
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
  margin-top: 1rem;
}

/* Buttons */
.btn-primary,
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
  margin-bottom: 1rem;
}

.empty-message {
  color: #7f8c8d;
  font-style: italic;
  padding: 1rem;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .battle-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .battle-header h2 {
    font-size: 1.5rem;
  }

  .inline-form {
    flex-direction: column;
  }

  .details-section {
    padding: 1rem;
  }
}
</style>
