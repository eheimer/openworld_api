<template>
  <div class="characters-component">
    <!-- Game Selection -->
    <div class="form-container">
      <h3>Select Game</h3>
      <div class="form-group">
        <label for="game-select">Choose a game to manage characters</label>
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

    <!-- Create Character Form -->
    <div v-if="selectedGameId" class="form-container">
      <h3>Create New Character</h3>
      <form @submit.prevent="handleCreateCharacter" class="character-form">
        <div class="form-group">
          <label for="character-name">Character Name</label>
          <input
            id="character-name"
            v-model="createForm.name"
            type="text"
            required
            placeholder="Enter character name"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="race-select">Race</label>
          <select
            id="race-select"
            v-model="createForm.raceId"
            required
            :disabled="isLoading || races.length === 0"
          >
            <option :value="null">-- Select a race --</option>
            <option v-for="race in races" :key="race.id" :value="race.id">
              {{ race.name }}
            </option>
          </select>
          <p v-if="selectedRace" class="race-description">
            {{ selectedRace.description }}
          </p>
        </div>

        <div class="attributes-section">
          <h4>Attributes</h4>
          <div class="attributes-grid">
            <div class="form-group">
              <label for="strength">Strength</label>
              <input
                id="strength"
                v-model.number="createForm.strength"
                type="number"
                required
                min="1"
                max="20"
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="dexterity">Dexterity</label>
              <input
                id="dexterity"
                v-model.number="createForm.dexterity"
                type="number"
                required
                min="1"
                max="20"
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="intelligence">Intelligence</label>
              <input
                id="intelligence"
                v-model.number="createForm.intelligence"
                type="number"
                required
                min="1"
                max="20"
                :disabled="isLoading"
              />
            </div>
          </div>
        </div>

        <div class="skills-section">
          <h4>Skills</h4>
          <div v-if="availableSkills.length === 0" class="empty-message">
            Loading skills...
          </div>
          <div v-else class="skills-grid">
            <div v-for="skill in availableSkills" :key="skill.id" class="skill-item">
              <label :for="`skill-${skill.id}`" class="skill-label">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-description">{{ skill.description }}</span>
              </label>
              <input
                :id="`skill-${skill.id}`"
                v-model.number="createForm.skillLevels[skill.id]"
                type="number"
                min="0"
                max="10"
                placeholder="Level (0-10)"
                :disabled="isLoading"
              />
            </div>
          </div>
        </div>

        <button type="submit" :disabled="isLoading || !canCreateCharacter" class="btn-primary">
          {{ isLoading ? 'Creating...' : 'Create Character' }}
        </button>

        <div v-if="createError" class="error-message">
          {{ createError }}
        </div>

        <div v-if="createSuccess" class="success-message">
          Character created successfully!
        </div>
      </form>
    </div>

    <!-- Characters List -->
    <div v-if="selectedGameId" class="characters-list-container">
      <h3>Characters in Game</h3>
      <button @click="loadCharacters" :disabled="isLoading" class="btn-secondary">
        {{ isLoading ? 'Loading...' : 'Refresh Characters' }}
      </button>

      <div v-if="charactersError" class="error-message">
        {{ charactersError }}
      </div>

      <div v-if="characters.length === 0 && !isLoading" class="empty-message">
        No characters found in this game. Create a character to get started!
      </div>

      <div v-if="characters.length > 0" class="characters-list">
        <div v-for="character in characters" :key="character.id" class="character-card">
          <div class="character-header">
            <h4>{{ character.name }}</h4>
            <span class="race-badge">{{ character.raceName }}</span>
          </div>

          <div class="character-info">
            <p><strong>Character ID:</strong> {{ character.id }}</p>
            <p><strong>Player:</strong> {{ character.player?.username || 'Unknown' }}</p>
          </div>

          <div class="character-actions">
            <button @click="viewCharacterDetails(character.id)" class="btn-secondary">
              View Details
            </button>
            <button 
              v-if="isOwnCharacter(character)" 
              @click="deleteCharacter(character.id)" 
              class="btn-danger"
              :disabled="isLoading"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Character Details Modal -->
    <div v-if="selectedCharacter" class="modal-overlay" @click="closeCharacterDetails">
      <div class="modal-content" @click.stop>
        <h3>{{ selectedCharacter.name }}</h3>
        
        <div class="details-section">
          <h4>Basic Information</h4>
          <p><strong>Race:</strong> {{ selectedCharacter.raceName }}</p>
          <p><strong>Player:</strong> {{ selectedCharacter.player?.username }}</p>
        </div>

        <div class="details-section" v-if="selectedCharacter.strength !== undefined">
          <h4>Attributes</h4>
          <div class="attributes-display">
            <div class="attribute-item">
              <span class="attribute-label">Strength:</span>
              <span class="attribute-value">{{ selectedCharacter.strength }}</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">Dexterity:</span>
              <span class="attribute-value">{{ selectedCharacter.dexterity }}</span>
            </div>
            <div class="attribute-item">
              <span class="attribute-label">Intelligence:</span>
              <span class="attribute-value">{{ selectedCharacter.intelligence }}</span>
            </div>
          </div>
        </div>

        <div class="details-section" v-if="selectedCharacter.skills && selectedCharacter.skills.length > 0">
          <h4>Skills</h4>
          <div class="skills-display">
            <div v-for="skill in selectedCharacter.skills" :key="skill.id" class="skill-display-item">
              <span class="skill-display-name">{{ skill.name }}</span>
              <span class="skill-display-level">Level {{ skill.level }}</span>
            </div>
          </div>
        </div>

        <div class="details-section" v-if="selectedCharacter.equipment">
          <h4>Equipment</h4>
          <p class="empty-message">Equipment display coming soon</p>
        </div>

        <button @click="closeCharacterDetails" class="btn-secondary">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'CharactersComponent',
  setup() {
    // State
    const games = ref([])
    const selectedGameId = ref(null)
    const characters = ref([])
    const selectedCharacter = ref(null)
    const races = ref([])
    const availableSkills = ref([])
    const isLoading = ref(false)

    // Create character form
    const createForm = ref({
      name: '',
      raceId: null,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      skillLevels: {}
    })
    const createError = ref('')
    const createSuccess = ref(false)

    // Errors
    const gamesError = ref('')
    const charactersError = ref('')

    // Get current player ID
    const getCurrentPlayerId = () => {
      return parseInt(localStorage.getItem('player_id'))
    }

    // Check if character belongs to current player
    const isOwnCharacter = (character) => {
      const currentPlayerId = getCurrentPlayerId()
      return character.player?.id === currentPlayerId
    }

    // Computed: selected race details
    const selectedRace = computed(() => {
      if (!createForm.value.raceId) return null
      return races.value.find(r => r.id === createForm.value.raceId)
    })

    // Computed: can create character
    const canCreateCharacter = computed(() => {
      return createForm.value.name && 
             createForm.value.raceId && 
             createForm.value.strength && 
             createForm.value.dexterity && 
             createForm.value.intelligence
    })

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
     * Load races from API
     */
    const loadRaces = async () => {
      try {
        const response = await apiService.get('/race')
        races.value = response.data
      } catch (error) {
        console.error('Failed to load races:', error)
      }
    }

    /**
     * Load skills from API
     */
    const loadSkills = async () => {
      try {
        const response = await apiService.get('/skills')
        availableSkills.value = response.data
        
        // Initialize skill levels to 0
        const skillLevels = {}
        availableSkills.value.forEach(skill => {
          skillLevels[skill.id] = 0
        })
        createForm.value.skillLevels = skillLevels
      } catch (error) {
        console.error('Failed to load skills:', error)
      }
    }

    /**
     * Handle game selection change
     */
    const onGameChange = () => {
      characters.value = []
      selectedCharacter.value = null
      charactersError.value = ''
      
      if (selectedGameId.value) {
        loadCharacters()
      }
    }

    /**
     * Load characters for selected game
     */
    const loadCharacters = async () => {
      if (!selectedGameId.value) return

      charactersError.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get(`/games/${selectedGameId.value}/characters`)
        characters.value = response.data
      } catch (error) {
        if (error.response) {
          charactersError.value = error.response.data.message || 'Failed to load characters'
        } else {
          charactersError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Create a new character
     */
    const handleCreateCharacter = async () => {
      createError.value = ''
      createSuccess.value = false
      isLoading.value = true

      try {
        // Build skills array from skill levels
        const skills = Object.entries(createForm.value.skillLevels)
          .filter(([_, level]) => level > 0)
          .map(([skillId, level]) => ({
            id: parseInt(skillId),
            level: level
          }))

        const characterData = {
          name: createForm.value.name,
          raceId: createForm.value.raceId,
          strength: createForm.value.strength,
          dexterity: createForm.value.dexterity,
          intelligence: createForm.value.intelligence,
          skills: skills
        }

        await apiService.post(`/games/${selectedGameId.value}/characters`, characterData)

        createSuccess.value = true
        
        // Reset form
        createForm.value.name = ''
        createForm.value.raceId = null
        createForm.value.strength = 10
        createForm.value.dexterity = 10
        createForm.value.intelligence = 10
        
        // Reset skill levels
        const skillLevels = {}
        availableSkills.value.forEach(skill => {
          skillLevels[skill.id] = 0
        })
        createForm.value.skillLevels = skillLevels
        
        // Reload characters list
        await loadCharacters()

        // Clear success message after 3 seconds
        setTimeout(() => {
          createSuccess.value = false
        }, 3000)
      } catch (error) {
        if (error.response) {
          createError.value = error.response.data.message || 'Failed to create character'
        } else {
          createError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * View character details
     */
    const viewCharacterDetails = async (characterId) => {
      isLoading.value = true
      charactersError.value = ''

      try {
        const response = await apiService.get(`/characters/${characterId}`)
        selectedCharacter.value = response.data
      } catch (error) {
        if (error.response) {
          charactersError.value = error.response.data.message || 'Failed to load character details'
        } else {
          charactersError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Close character details modal
     */
    const closeCharacterDetails = () => {
      selectedCharacter.value = null
    }

    /**
     * Delete a character
     */
    const deleteCharacter = async (characterId) => {
      if (!confirm('Are you sure you want to delete this character?')) {
        return
      }

      isLoading.value = true
      charactersError.value = ''

      try {
        await apiService.delete(`/characters/${characterId}`)
        
        // Reload characters list
        await loadCharacters()

        // Close details if this character was selected
        if (selectedCharacter.value?.id === characterId) {
          closeCharacterDetails()
        }
      } catch (error) {
        if (error.response) {
          charactersError.value = error.response.data.message || 'Failed to delete character'
        } else {
          charactersError.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    // Load initial data on component mount
    onMounted(() => {
      loadGames()
      loadRaces()
      loadSkills()
    })

    return {
      games,
      selectedGameId,
      characters,
      selectedCharacter,
      races,
      availableSkills,
      isLoading,
      createForm,
      createError,
      createSuccess,
      gamesError,
      charactersError,
      selectedRace,
      canCreateCharacter,
      loadGames,
      onGameChange,
      loadCharacters,
      handleCreateCharacter,
      viewCharacterDetails,
      closeCharacterDetails,
      deleteCharacter,
      isOwnCharacter
    }
  }
}
</script>

<style scoped>
.characters-component {
  max-width: 1400px;
  margin: 0 auto;
}

.form-container,
.characters-list-container {
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

.character-form {
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
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

.race-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 0.25rem;
}

/* Attributes Section */
.attributes-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

/* Skills Section */
.skills-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e1e4e8;
}

.skill-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
}

.skill-name {
  font-weight: 500;
  color: #2c3e50;
}

.skill-description {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.skill-item input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
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

/* Characters List */
.characters-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.character-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.character-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.character-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.character-header h4 {
  margin: 0;
  color: #2c3e50;
}

.race-badge {
  background: #9b59b6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.character-info {
  margin-bottom: 1rem;
}

.character-info p {
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
}

.character-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Character Details Modal */
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
  max-width: 600px;
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

.attributes-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.attribute-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.attribute-label {
  font-weight: 500;
  color: #2c3e50;
}

.attribute-value {
  font-weight: 600;
  color: #3498db;
  font-size: 1.1rem;
}

.skills-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skill-display-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.skill-display-name {
  font-weight: 500;
  color: #2c3e50;
}

.skill-display-level {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .characters-list {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .attributes-grid {
    grid-template-columns: 1fr;
  }

  .character-actions {
    flex-direction: column;
  }

  .character-actions button {
    width: 100%;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }
}
</style>
