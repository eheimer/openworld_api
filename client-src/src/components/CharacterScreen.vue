<template>
  <div class="character-screen">
    <div class="character-screen-container">
      <h2>{{ characterName }}</h2>
      <p class="subtitle">{{ raceName }} - Level {{ characterLevel }}</p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="loading-message">
        Loading character details...
      </div>

      <!-- Character Stats -->
      <div class="stats-section">
        <h3>Character Stats</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">💪</div>
            <div class="stat-info">
              <span class="stat-label">Strength</span>
              <span class="stat-value">{{ character.strength }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <span class="stat-label">Dexterity</span>
              <span class="stat-value">{{ character.dexterity }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🧠</div>
            <div class="stat-info">
              <span class="stat-label">Intelligence</span>
              <span class="stat-value">{{ character.intelligence }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div v-if="character.skills && character.skills.length > 0" class="skills-section">
        <h3>Skills</h3>
        <div class="skills-grid">
          <div 
            v-for="skill in character.skills" 
            :key="skill.id"
            class="skill-card"
          >
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-level">Level {{ skill.level }}</span>
          </div>
        </div>
      </div>

      <!-- Battle Action -->
      <div class="battle-section">
        <button 
          @click="handleStartBattle" 
          class="btn-start-battle"
          :disabled="isInBattle"
        >
          {{ isInBattle ? 'Already in Battle' : '⚔️ Start Battle' }}
        </button>
        <p v-if="isInBattle" class="battle-info">
          You are currently in a battle. Use the menu to navigate to the battle screen.
        </p>
      </div>

      <!-- Inventory Display -->
      <div class="inventory-section">
        <h3>Inventory</h3>
        <InventoryDisplay 
          :character-id="character.id"
          :inventory-id="inventoryId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { inject, computed, ref, onMounted } from 'vue'
import InventoryDisplay from './InventoryDisplay.vue'
import apiService from '../services/apiService.js'

export default {
  name: 'CharacterScreen',
  components: {
    InventoryDisplay
  },
  setup() {
    // Inject game state (Requirement 9.2)
    const gameState = inject('gameState')

    // Component state
    const errorMessage = ref('')
    const characterDetails = ref(null)
    const isLoading = ref(false)

    /**
     * Get character from state or loaded details
     * Requirement 4.4 - display character details from state.character
     */
    const character = computed(() => characterDetails.value || gameState.state.character)

    /**
     * Computed properties for character details
     */
    const characterName = computed(() => character.value?.name || 'Unknown')
    const raceName = computed(() => character.value?.race?.name || 'Unknown')
    const characterLevel = computed(() => character.value?.level || 1)
    const inventoryId = computed(() => character.value?.inventory?.id || null)

    /**
     * Check if character is in a battle
     */
    const isInBattle = computed(() => gameState.state.battle !== null)

    /**
     * Load full character details from API
     */
    const loadCharacterDetails = async () => {
      const characterId = gameState.state.character?.id
      if (!characterId) {
        errorMessage.value = 'No character selected'
        return
      }

      isLoading.value = true
      errorMessage.value = ''

      try {
        const response = await apiService.get(`/characters/${characterId}`)
        characterDetails.value = response.data
      } catch (error) {
        console.error('Failed to load character details:', error)
        errorMessage.value = 'Failed to load character details'
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Handle start battle button click
     * Requirement 4.4 - add start battle button that navigates to BattleCreateScreen
     */
    const handleStartBattle = () => {
      if (isInBattle.value) {
        errorMessage.value = 'You are already in a battle'
        return
      }

      // Emit event to navigate to battle create screen
      window.dispatchEvent(new CustomEvent('navigate:battle-create'))
    }

    // Load character details on mount
    onMounted(() => {
      loadCharacterDetails()
    })

    return {
      character,
      characterName,
      raceName,
      characterLevel,
      inventoryId,
      isInBattle,
      isLoading,
      errorMessage,
      handleStartBattle
    }
  }
}
</script>

<style scoped>
.character-screen {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  overflow-y: auto;
}

.character-screen-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 1200px;
  width: 100%;
}

.character-screen-container h2 {
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

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border: 2px solid #e1e4e8;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-value {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
}

/* Skills Section */
.skills-section {
  margin-bottom: 2rem;
}

.skills-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.skill-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 2px solid #e1e4e8;
}

.skill-name {
  color: #2c3e50;
  font-weight: 600;
}

.skill-level {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Battle Section */
.battle-section {
  margin-bottom: 2rem;
  text-align: center;
}

.btn-start-battle {
  padding: 1.25rem 3rem;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.btn-start-battle:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.btn-start-battle:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-start-battle:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.battle-info {
  margin-top: 1rem;
  color: #7f8c8d;
  font-size: 0.95rem;
  font-style: italic;
}

/* Inventory Section */
.inventory-section {
  margin-top: 2rem;
}

.inventory-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .character-screen {
    padding: 1rem;
  }

  .character-screen-container {
    padding: 2rem 1.5rem;
  }

  .character-screen-container h2 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .btn-start-battle {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
}
</style>
