<template>
  <div class="battle-create-screen">
    <div class="battle-create-container">
      <h2>⚔️ Create Battle</h2>
      <p class="subtitle">Choose your opponent</p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="loading" class="loading-message">
        Loading monsters...
      </div>

      <div v-else-if="monsters.length > 0" class="monster-selection">
        <div class="monster-grid">
          <div 
            v-for="(monster, index) in monsters" 
            :key="monster.id"
            :ref="index === 0 ? 'firstMonsterCard' : undefined"
            :class="['monster-card', { selected: selectedMonsterId === monster.id }]"
            @click="selectMonster(monster.id)"
            tabindex="0"
            @keydown.enter="selectMonster(monster.id)"
            @keydown.space.prevent="selectMonster(monster.id)"
          >
            <div class="monster-image">
              <img 
                v-if="monster.imageUrl" 
                :src="monster.imageUrl" 
                :alt="monster.name"
                @error="handleImageError"
              />
              <div v-else class="monster-placeholder">🐉</div>
            </div>
            <div class="monster-info">
              <h3>{{ monster.name }}</h3>
              <div class="monster-stats">
                <span class="stat">❤️ HP: {{ monster.hitPoints }}</span>
                <span class="stat">⚔️ ATK: {{ monster.attack }}</span>
                <span class="stat">🛡️ DEF: {{ monster.defense }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            @click="handleCreateBattle" 
            class="btn-create"
            :disabled="!selectedMonsterId || creating"
          >
            {{ creating ? 'Creating...' : 'Create Battle' }}
          </button>
          <button 
            @click="handleCancel" 
            class="btn-cancel"
            :disabled="creating"
          >
            Cancel
          </button>
        </div>
      </div>

      <div v-else class="no-monsters">
        <p>No monsters available. Please contact an administrator.</p>
        <button @click="handleCancel" class="btn-cancel">
          Back to Character
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref, onMounted, computed } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'BattleCreateScreen',
  setup() {
    // Inject game state (Requirement 10.1, 10.2)
    const gameState = inject('gameState')

    // Component state
    const monsters = ref([])
    const selectedMonsterId = ref(null)
    const loading = ref(true)
    const creating = ref(false)
    const errorMessage = ref('')
    const firstMonsterCard = ref(null)

    /**
     * Get character ID from state automatically
     * Requirement 10.1 - use character.id from state automatically
     */
    const characterId = computed(() => gameState.state.character?.id)

    /**
     * Check if character is already in a battle
     * Requirement 10.1, 10.2 - implement battle constraint check
     */
    const isInBattle = computed(() => gameState.state.battle !== null)

    /**
     * Load monsters from API
     */
    const loadMonsters = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        
        const response = await apiService.get('/monsters')
        monsters.value = response.data || []
      } catch (error) {
        console.error('Failed to load monsters:', error)
        errorMessage.value = 'Failed to load monsters. Please try again.'
      } finally {
        loading.value = false
      }
    }

    /**
     * Select a monster
     */
    const selectMonster = (monsterId) => {
      selectedMonsterId.value = monsterId
      errorMessage.value = ''
    }

    /**
     * Handle image load error
     */
    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    /**
     * Create battle
     * Requirement 10.1, 10.2 - prevent if already in battle
     */
    const handleCreateBattle = async () => {
      // Check battle constraint
      if (isInBattle.value) {
        errorMessage.value = 'You are already in a battle. Please finish your current battle first.'
        return
      }

      if (!selectedMonsterId.value) {
        errorMessage.value = 'Please select a monster to battle.'
        return
      }

      if (!characterId.value) {
        errorMessage.value = 'No character selected. Please select a character first.'
        return
      }

      try {
        creating.value = true
        errorMessage.value = ''

        // Create battle using API service
        const battle = await apiService.createBattle(characterId.value, selectedMonsterId.value)
        
        // Update state with new battle (Requirement 10.1)
        gameState.setBattle(battle)

        // Navigation will happen automatically via state change
      } catch (error) {
        console.error('Failed to create battle:', error)
        
        // Check if error is due to existing battle
        if (error.response && error.response.status === 409) {
          errorMessage.value = 'You are already in a battle. Please finish your current battle first.'
        } else if (error.response && error.response.data && error.response.data.message) {
          errorMessage.value = error.response.data.message
        } else {
          errorMessage.value = 'Failed to create battle. Please try again.'
        }
      } finally {
        creating.value = false
      }
    }

    /**
     * Cancel battle creation and return to character screen
     */
    const handleCancel = () => {
      // Clear temp screen - will navigate to character screen since battle is null
      gameState.clearTempScreen()
    }

    /**
     * Check for existing battle on mount
     */
    onMounted(async () => {
      // Check if already in battle (Requirement 10.1, 10.2)
      if (isInBattle.value) {
        errorMessage.value = 'You are already in a battle. Please finish your current battle first.'
        // Don't load monsters if already in battle
        loading.value = false
        return
      }

      // Load monsters
      await loadMonsters()
      
      // Auto-focus first monster card after loading
      setTimeout(() => {
        firstMonsterCard.value?.focus()
      }, 100)
    })

    return {
      monsters,
      selectedMonsterId,
      loading,
      creating,
      errorMessage,
      isInBattle,
      firstMonsterCard,
      selectMonster,
      handleImageError,
      handleCreateBattle,
      handleCancel
    }
  }
}
</script>

<style scoped>
.battle-create-screen {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  padding: 2rem;
  overflow-y: auto;
}

.battle-create-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 1400px;
  width: 100%;
}

.battle-create-container h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  text-align: center;
}

.subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.error-message {
  padding: 1rem;
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.loading-message {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.2rem;
}

.no-monsters {
  text-align: center;
  padding: 3rem;
}

.no-monsters p {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

/* Monster Selection */
.monster-selection {
  margin-top: 2rem;
}

.monster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.monster-card {
  background: #f8f9fa;
  border: 3px solid #e1e4e8;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.monster-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #e74c3c;
}

.monster-card.selected {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
}

.monster-card:focus {
  outline: 3px solid #e74c3c;
  outline-offset: 2px;
}

.monster-image {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

.monster-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.monster-placeholder {
  font-size: 4rem;
}

.monster-info {
  text-align: center;
  width: 100%;
}

.monster-info h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.3rem;
}

.monster-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat {
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid #e1e4e8;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-create,
.btn-cancel {
  padding: 1rem 3rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-create {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.btn-create:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-create:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.btn-cancel {
  background: #ecf0f1;
  color: #2c3e50;
  border: 2px solid #bdc3c7;
}

.btn-cancel:hover:not(:disabled) {
  background: #bdc3c7;
  transform: translateY(-2px);
}

.btn-cancel:active:not(:disabled) {
  transform: translateY(0);
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .battle-create-screen {
    padding: 1rem;
  }

  .battle-create-container {
    padding: 2rem 1.5rem;
  }

  .battle-create-container h2 {
    font-size: 2rem;
  }

  .monster-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-create,
  .btn-cancel {
    width: 100%;
    padding: 1rem 2rem;
  }
}
</style>
