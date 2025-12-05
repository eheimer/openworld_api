<template>
  <div class="character-create-screen">
    <div class="character-create-container">
      <h2>Create Your Character</h2>
      <p class="subtitle">Begin your adventure in {{ gameName }}</p>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="isLoadingData" class="loading-message">
        Loading character creation data...
      </div>

      <form v-else @submit.prevent="handleCreateCharacter" class="character-create-form">
        <!-- Character Name -->
        <div class="form-group">
          <label for="characterName">Character Name</label>
          <input
            id="characterName"
            ref="characterNameInput"
            v-model="characterName"
            type="text"
            placeholder="Enter your character's name"
            required
            :disabled="isCreating"
            maxlength="50"
          />
        </div>

        <!-- Race Selection -->
        <div class="form-group">
          <label for="race">Race</label>
          <select
            id="race"
            v-model="selectedRaceId"
            required
            :disabled="isCreating"
          >
            <option value="" disabled>Select a race</option>
            <option 
              v-for="race in races" 
              :key="race.id" 
              :value="race.id"
            >
              {{ race.name }}
            </option>
          </select>
        </div>

        <!-- Stats -->
        <div class="stats-section">
          <h3>Stats ({{ remainingStatPoints }} points remaining)</h3>
          
          <div class="stat-group">
            <label for="strength">Strength</label>
            <div class="stat-control">
              <button 
                type="button" 
                @click="decrementStat('strength')"
                :disabled="isCreating || stats.strength <= 1"
                class="btn-stat"
              >
                -
              </button>
              <input
                id="strength"
                v-model.number="stats.strength"
                type="number"
                min="1"
                max="4"
                :disabled="isCreating"
                class="stat-input"
                readonly
              />
              <button 
                type="button" 
                @click="incrementStat('strength')"
                :disabled="isCreating || remainingStatPoints <= 0 || stats.strength >= 4"
                class="btn-stat"
              >
                +
              </button>
            </div>
          </div>

          <div class="stat-group">
            <label for="intelligence">Intelligence</label>
            <div class="stat-control">
              <button 
                type="button" 
                @click="decrementStat('intelligence')"
                :disabled="isCreating || stats.intelligence <= 1"
                class="btn-stat"
              >
                -
              </button>
              <input
                id="intelligence"
                v-model.number="stats.intelligence"
                type="number"
                min="1"
                max="4"
                :disabled="isCreating"
                class="stat-input"
                readonly
              />
              <button 
                type="button" 
                @click="incrementStat('intelligence')"
                :disabled="isCreating || remainingStatPoints <= 0 || stats.intelligence >= 4"
                class="btn-stat"
              >
                +
              </button>
            </div>
          </div>

          <div class="stat-group">
            <label for="dexterity">Dexterity</label>
            <div class="stat-control">
              <button 
                type="button" 
                @click="decrementStat('dexterity')"
                :disabled="isCreating || stats.dexterity <= 1"
                class="btn-stat"
              >
                -
              </button>
              <input
                id="dexterity"
                v-model.number="stats.dexterity"
                type="number"
                min="1"
                max="4"
                :disabled="isCreating"
                class="stat-input"
                readonly
              />
              <button 
                type="button" 
                @click="incrementStat('dexterity')"
                :disabled="isCreating || remainingStatPoints <= 0 || stats.dexterity >= 4"
                class="btn-stat"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Skills Selection -->
        <div class="skills-section">
          <h3>Skills ({{ remainingSkillPoints }} points remaining)</h3>
          <div class="skills-list">
            <div 
              v-for="skill in skills" 
              :key="skill.id"
              class="skill-item"
            >
              <label class="skill-label">
                <input
                  type="checkbox"
                  :value="skill.id"
                  :checked="selectedSkillIds.includes(skill.id)"
                  @change="toggleSkill(skill.id)"
                  :disabled="isCreating"
                />
                <span>{{ skill.name }}</span>
              </label>
              <div v-if="selectedSkillIds.includes(skill.id)" class="skill-control">
                <button 
                  type="button" 
                  @click="decrementSkill(skill.id)"
                  :disabled="isCreating || skillLevels[skill.id] <= 1"
                  class="btn-skill"
                >
                  -
                </button>
                <input
                  type="number"
                  v-model.number="skillLevels[skill.id]"
                  min="1"
                  max="4"
                  :disabled="isCreating"
                  class="skill-level-input"
                  readonly
                />
                <button 
                  type="button" 
                  @click="incrementSkill(skill.id)"
                  :disabled="isCreating || remainingSkillPoints <= 0 || skillLevels[skill.id] >= 4"
                  class="btn-skill"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button 
            type="submit" 
            class="btn-create"
            :disabled="isCreating || !isFormValid"
          >
            {{ isCreating ? 'Creating...' : 'Create Character' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted, computed } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'CharacterCreateScreen',
  setup() {
    // Inject game state
    const gameState = inject('gameState')

    // Component state
    const characterName = ref('')
    const characterNameInput = ref(null)
    const selectedRaceId = ref('')
    const stats = ref({
      strength: 1,
      intelligence: 1,
      dexterity: 1
    })
    const selectedSkillIds = ref([])
    const skillLevels = ref({})
    
    const races = ref([])
    const skills = ref([])
    
    const isLoadingData = ref(false)
    const isCreating = ref(false)
    const errorMessage = ref('')

    // Total stat points available (starts at 8, with 3 already allocated as 1 each)
    const TOTAL_STAT_POINTS = 11 // 8 + 3 (initial values)
    const TOTAL_SKILL_POINTS = 28

    /**
     * Computed property for game name from state
     */
    const gameName = computed(() => {
      return gameState.state.game?.name || 'Unknown Game'
    })

    /**
     * Computed property for remaining stat points
     */
    const remainingStatPoints = computed(() => {
      const used = stats.value.strength + stats.value.intelligence + stats.value.dexterity
      return TOTAL_STAT_POINTS - used
    })

    /**
     * Computed property for remaining skill points
     */
    const remainingSkillPoints = computed(() => {
      const used = selectedSkillIds.value.reduce((sum, skillId) => {
        return sum + (skillLevels.value[skillId] || 0)
      }, 0)
      return TOTAL_SKILL_POINTS - used
    })

    /**
     * Computed property to check if form is valid
     */
    const isFormValid = computed(() => {
      return (
        characterName.value.trim() !== '' &&
        selectedRaceId.value !== '' &&
        remainingStatPoints.value === 0 &&
        remainingSkillPoints.value === 0 &&
        selectedSkillIds.value.length > 0
      )
    })

    /**
     * Increment stat value
     */
    const incrementStat = (stat) => {
      if (remainingStatPoints.value > 0 && stats.value[stat] < 4) {
        stats.value[stat]++
      }
    }

    /**
     * Decrement stat value
     */
    const decrementStat = (stat) => {
      if (stats.value[stat] > 1) {
        stats.value[stat]--
      }
    }

    /**
     * Toggle skill selection
     */
    const toggleSkill = (skillId) => {
      const index = selectedSkillIds.value.indexOf(skillId)
      if (index > -1) {
        // Uncheck - remove from selected and set level to 0
        selectedSkillIds.value.splice(index, 1)
        skillLevels.value[skillId] = 0
      } else {
        // Check - add to selected and set level to 1
        selectedSkillIds.value.push(skillId)
        skillLevels.value[skillId] = 1
      }
    }

    /**
     * Increment skill level
     */
    const incrementSkill = (skillId) => {
      if (remainingSkillPoints.value > 0 && skillLevels.value[skillId] < 4) {
        skillLevels.value[skillId]++
      }
    }

    /**
     * Decrement skill level
     */
    const decrementSkill = (skillId) => {
      if (skillLevels.value[skillId] > 1) {
        skillLevels.value[skillId]--
      }
    }

    /**
     * Load races and skills from API
     */
    const loadCharacterData = async () => {
      isLoadingData.value = true
      errorMessage.value = ''

      try {
        // Load races
        const racesResponse = await apiService.get('/race')
        races.value = racesResponse.data

        // Load skills
        const skillsResponse = await apiService.get('/skills')
        skills.value = skillsResponse.data

        // Initialize skill levels for all skills to 0
        skills.value.forEach(skill => {
          skillLevels.value[skill.id] = 0
        })
      } catch (error) {
        errorMessage.value = 'Failed to load character creation data. Please try again.'
        console.error('Failed to load character data:', error)
      } finally {
        isLoadingData.value = false
      }
    }

    /**
     * Handle character creation
     * Requirements 4.3, 6.3 - create character and update state
     */
    const handleCreateCharacter = async () => {
      errorMessage.value = ''

      // Validate form
      if (!isFormValid.value) {
        errorMessage.value = 'Please complete all required fields'
        return
      }

      isCreating.value = true

      try {
        // Use game.id from state automatically (Requirement 9.2)
        const gameId = gameState.state.game.id

        // Build skills array with selected skills and their levels
        const characterSkills = selectedSkillIds.value.map(skillId => ({
          id: skillId,
          level: skillLevels.value[skillId]
        }))

        // Create character data object
        const characterData = {
          name: characterName.value.trim(),
          raceId: selectedRaceId.value,
          strength: stats.value.strength,
          intelligence: stats.value.intelligence,
          dexterity: stats.value.dexterity,
          skills: characterSkills
        }

        // Call API to create character
        const response = await apiService.post(`/games/${gameId}/characters`, characterData)
        const createdCharacter = response.data

        // Update state with created character (Requirement 3.4)
        gameState.setCharacter(createdCharacter)

        // Try to auto-load battle if character has one
        if (createdCharacter.id) {
          await gameState.autoLoadBattle(apiService, createdCharacter.id)
        }

        // Navigation will happen automatically via state change
      } catch (error) {
        if (error.response) {
          errorMessage.value = error.response.data.message || 'Failed to create character'
        } else if (error.request) {
          errorMessage.value = 'Network error. Please check your connection.'
        } else {
          errorMessage.value = 'An unexpected error occurred. Please try again.'
        }
        isCreating.value = false
      }
    }

    // Load character data on component mount
    onMounted(async () => {
      await loadCharacterData()
      // Auto-focus character name field after data loads
      characterNameInput.value?.focus()
    })

    return {
      characterName,
      characterNameInput,
      selectedRaceId,
      stats,
      selectedSkillIds,
      skillLevels,
      races,
      skills,
      isLoadingData,
      isCreating,
      errorMessage,
      gameName,
      remainingStatPoints,
      remainingSkillPoints,
      isFormValid,
      incrementStat,
      decrementStat,
      toggleSkill,
      incrementSkill,
      decrementSkill,
      handleCreateCharacter
    }
  }
}
</script>

<style scoped>
.character-create-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.character-create-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.character-create-container h2 {
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

.character-create-form {
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

.form-group input,
.form-group select {
  padding: 0.875rem;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.stats-section,
.skills-section {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stats-section h3,
.skills-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stat-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.stat-group label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
  flex: 1;
}

.stat-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-stat,
.btn-skill {
  width: 36px;
  height: 36px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-stat:hover:not(:disabled),
.btn-skill:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.btn-stat:disabled,
.btn-skill:disabled {
  border-color: #e1e4e8;
  color: #95a5a6;
  cursor: not-allowed;
}

.stat-input {
  width: 60px;
  text-align: center;
  padding: 0.5rem;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  background: white;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 2px solid #e1e4e8;
}

.skill-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex: 1;
}

.skill-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.skill-label span {
  color: #2c3e50;
  font-weight: 500;
}

.skill-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-level-input {
  width: 60px;
  padding: 0.5rem;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 600;
  background: white;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-create {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
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

@media (max-width: 768px) {
  .character-create-screen {
    padding: 1rem;
  }

  .character-create-container {
    padding: 2rem 1.5rem;
  }

  .character-create-container h2 {
    font-size: 1.75rem;
  }

  .stat-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .skill-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .skill-control {
    width: 100%;
  }
}
</style>
