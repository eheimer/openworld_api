<template>
  <div class="inventory-component">
    <!-- Character Selection -->
    <div class="form-container">
      <h3>Select Character</h3>
      <div class="form-group">
        <label for="game-select">Choose a game</label>
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

      <div v-if="selectedGameId" class="form-group">
        <label for="character-select">Choose a character</label>
        <select
          id="character-select"
          v-model="selectedCharacterId"
          @change="onCharacterChange"
          :disabled="isLoading || characters.length === 0"
        >
          <option :value="null">-- Select a character --</option>
          <option v-for="character in characters" :key="character.id" :value="character.id">
            {{ character.name }} (ID: {{ character.id }})
          </option>
        </select>
      </div>

      <button @click="loadGames" :disabled="isLoading" class="btn-secondary">
        {{ isLoading ? 'Loading...' : 'Refresh Games' }}
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <!-- Inventory Management -->
    <div v-if="inventoryId" class="inventory-container">
      <!-- Add Random Item -->
      <div class="form-container">
        <h3>Add Random Item</h3>
        <form @submit.prevent="handleAddRandomItem" class="add-item-form">
          <div class="form-row">
            <div class="form-group">
              <label for="item-type">Item Type</label>
              <select
                id="item-type"
                v-model="addItemForm.itemType"
                required
                :disabled="isLoading"
              >
                <option value="armor">Armor</option>
                <option value="weapon">Weapon</option>
                <option value="jewelry">Jewelry</option>
                <option value="spellbook">Spellbook</option>
              </select>
            </div>

            <div class="form-group">
              <label for="item-level">Level</label>
              <input
                id="item-level"
                v-model.number="addItemForm.level"
                type="number"
                required
                min="1"
                max="10"
                :disabled="isLoading"
              />
            </div>

            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? 'Adding...' : 'Add Item' }}
            </button>
          </div>
        </form>

        <div v-if="addItemSuccess" class="success-message">
          Item added successfully!
        </div>
      </div>

      <!-- Equipped Items -->
      <div v-if="inventory" class="equipped-container">
        <h3>Equipped Items</h3>
        <div v-if="hasEquippedItems" class="equipped-items">
          <div v-if="inventory.equippedArmor && inventory.equippedArmor.length > 0" class="equipped-section">
            <h4>Equipped Armor</h4>
            <div class="items-grid">
              <div v-for="item in inventory.equippedArmor" :key="item.id" class="item-card equipped">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>Class:</strong> {{ item.armorClass }}</p>
                  <p><strong>Location:</strong> {{ item.location }}</p>
                </div>
                <button @click="unequipItem('armor', item.id)" :disabled="isLoading" class="btn-secondary">
                  Unequip
                </button>
              </div>
            </div>
          </div>

          <div v-if="inventory.equippedWeapons && inventory.equippedWeapons.length > 0" class="equipped-section">
            <h4>Equipped Weapons</h4>
            <div class="items-grid">
              <div v-for="item in inventory.equippedWeapons" :key="item.id" class="item-card equipped">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>Skill:</strong> {{ item.weaponSkill }}</p>
                  <p><strong>Damage:</strong> {{ item.damage }}</p>
                </div>
                <button @click="unequipItem('weapon', item.id)" :disabled="isLoading" class="btn-secondary">
                  Unequip
                </button>
              </div>
            </div>
          </div>

          <div v-if="inventory.equippedJewelry && inventory.equippedJewelry.length > 0" class="equipped-section">
            <h4>Equipped Jewelry</h4>
            <div class="items-grid">
              <div v-for="item in inventory.equippedJewelry" :key="item.id" class="item-card equipped">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>Location:</strong> {{ item.location }}</p>
                </div>
                <button @click="unequipItem('jewelry', item.id)" :disabled="isLoading" class="btn-secondary">
                  Unequip
                </button>
              </div>
            </div>
          </div>

          <div v-if="inventory.equippedSpellbooks && inventory.equippedSpellbooks.length > 0" class="equipped-section">
            <h4>Equipped Spellbooks</h4>
            <div class="items-grid">
              <div v-for="item in inventory.equippedSpellbooks" :key="item.id" class="item-card equipped">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>School:</strong> {{ item.spellSchool }}</p>
                </div>
                <button @click="unequipItem('spellbook', item.id)" :disabled="isLoading" class="btn-secondary">
                  Unequip
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-message">
          No items equipped
        </div>
      </div>

      <!-- Inventory Contents -->
      <div v-if="inventory" class="inventory-contents">
        <h3>Inventory Contents</h3>
        <button @click="loadInventory" :disabled="isLoading" class="btn-secondary">
          {{ isLoading ? 'Loading...' : 'Refresh Inventory' }}
        </button>

        <div v-if="hasInventoryItems" class="inventory-sections">
          <!-- Armor -->
          <div v-if="inventory.armor && inventory.armor.length > 0" class="inventory-section">
            <h4>Armor ({{ inventory.armor.length }})</h4>
            <div class="items-grid">
              <div v-for="item in inventory.armor" :key="item.id" class="item-card">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>Class:</strong> {{ item.armorClass }}</p>
                  <p><strong>Location:</strong> {{ item.location }}</p>
                </div>
                <div class="item-actions">
                  <button @click="equipItem('armor', item.id)" :disabled="isLoading" class="btn-primary">
                    Equip
                  </button>
                  <button @click="dropItem('armor', item.id)" :disabled="isLoading" class="btn-danger">
                    Drop
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Weapons -->
          <div v-if="inventory.weapons && inventory.weapons.length > 0" class="inventory-section">
            <h4>Weapons ({{ inventory.weapons.length }})</h4>
            <div class="items-grid">
              <div v-for="item in inventory.weapons" :key="item.id" class="item-card">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>Skill:</strong> {{ item.weaponSkill }}</p>
                  <p><strong>Damage:</strong> {{ item.damage }}</p>
                </div>
                <div class="item-actions">
                  <button @click="equipItem('weapon', item.id)" :disabled="isLoading" class="btn-primary">
                    Equip
                  </button>
                  <button @click="dropItem('weapon', item.id)" :disabled="isLoading" class="btn-danger">
                    Drop
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Jewelry -->
          <div v-if="inventory.jewelry && inventory.jewelry.length > 0" class="inventory-section">
            <h4>Jewelry ({{ inventory.jewelry.length }})</h4>
            <div class="items-grid">
              <div v-for="item in inventory.jewelry" :key="item.id" class="item-card">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>Location:</strong> {{ item.location }}</p>
                </div>
                <div class="item-actions">
                  <button @click="equipItem('jewelry', item.id)" :disabled="isLoading" class="btn-primary">
                    Equip
                  </button>
                  <button @click="dropItem('jewelry', item.id)" :disabled="isLoading" class="btn-danger">
                    Drop
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Spellbooks -->
          <div v-if="inventory.spellbooks && inventory.spellbooks.length > 0" class="inventory-section">
            <h4>Spellbooks ({{ inventory.spellbooks.length }})</h4>
            <div class="items-grid">
              <div v-for="item in inventory.spellbooks" :key="item.id" class="item-card">
                <div class="item-header">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-level">Lvl {{ item.level }}</span>
                </div>
                <div class="item-details">
                  <p><strong>School:</strong> {{ item.spellSchool }}</p>
                </div>
                <div class="item-actions">
                  <button @click="equipItem('spellbook', item.id)" :disabled="isLoading" class="btn-primary">
                    Equip
                  </button>
                  <button @click="dropItem('spellbook', item.id)" :disabled="isLoading" class="btn-danger">
                    Drop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-message">
          Inventory is empty. Add some items to get started!
        </div>
      </div>

      <!-- Character Stats -->
      <div v-if="characterStats" class="stats-container">
        <h3>Character Stats</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Strength:</span>
            <span class="stat-value">{{ characterStats.strength }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Dexterity:</span>
            <span class="stat-value">{{ characterStats.dexterity }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Intelligence:</span>
            <span class="stat-value">{{ characterStats.intelligence }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'InventoryComponent',
  setup() {
    // State
    const games = ref([])
    const selectedGameId = ref(null)
    const characters = ref([])
    const selectedCharacterId = ref(null)
    const inventoryId = ref(null)
    const inventory = ref(null)
    const characterStats = ref(null)
    const isLoading = ref(false)
    const error = ref('')

    // Add item form
    const addItemForm = ref({
      itemType: 'armor',
      level: 1
    })
    const addItemSuccess = ref(false)

    /**
     * Load all games for the current player
     */
    const loadGames = async () => {
      error.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get('/games')
        games.value = response.data
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to load games'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Handle game selection change
     */
    const onGameChange = async () => {
      characters.value = []
      selectedCharacterId.value = null
      inventoryId.value = null
      inventory.value = null
      characterStats.value = null
      error.value = ''

      if (selectedGameId.value) {
        await loadCharacters()
      }
    }

    /**
     * Load characters for selected game
     */
    const loadCharacters = async () => {
      if (!selectedGameId.value) return

      error.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get(`/games/${selectedGameId.value}/characters`)
        characters.value = response.data
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to load characters'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Handle character selection change
     */
    const onCharacterChange = async () => {
      inventoryId.value = null
      inventory.value = null
      characterStats.value = null
      error.value = ''

      if (selectedCharacterId.value) {
        await loadCharacterDetails()
      }
    }

    /**
     * Load character details to get inventory ID
     */
    const loadCharacterDetails = async () => {
      if (!selectedCharacterId.value) return

      error.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get(`/characters/${selectedCharacterId.value}`)
        const character = response.data

        if (character.inventory) {
          inventoryId.value = character.inventory.id
          await loadInventory()
        }

        // Store character stats
        characterStats.value = {
          strength: character.strength,
          dexterity: character.dexterity,
          intelligence: character.intelligence
        }
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to load character details'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Load inventory contents
     */
    const loadInventory = async () => {
      if (!inventoryId.value) return

      error.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get(`/inventory/${inventoryId.value}`)
        inventory.value = response.data
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to load inventory'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Add random item to inventory
     */
    const handleAddRandomItem = async () => {
      error.value = ''
      addItemSuccess.value = false
      isLoading.value = true

      try {
        await apiService.post(`/inventory/${inventoryId.value}/random`, {
          itemType: addItemForm.value.itemType,
          level: addItemForm.value.level
        })

        addItemSuccess.value = true
        await loadInventory()

        // Clear success message after 3 seconds
        setTimeout(() => {
          addItemSuccess.value = false
        }, 3000)
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to add item'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Equip an item
     */
    const equipItem = async (itemType, itemId) => {
      error.value = ''
      isLoading.value = true

      try {
        await apiService.put(`/inventory/${inventoryId.value}/equip/${itemType}/${itemId}`)
        await loadInventory()
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to equip item'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Unequip an item
     */
    const unequipItem = async (itemType, itemId) => {
      error.value = ''
      isLoading.value = true

      try {
        await apiService.put(`/inventory/${inventoryId.value}/unequip/${itemType}/${itemId}`)
        await loadInventory()
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to unequip item'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Drop an item
     */
    const dropItem = async (itemType, itemId) => {
      if (!confirm('Are you sure you want to drop this item?')) {
        return
      }

      error.value = ''
      isLoading.value = true

      try {
        await apiService.put(`/inventory/${inventoryId.value}/drop/${itemType}/${itemId}`)
        await loadInventory()
      } catch (err) {
        if (err.response) {
          error.value = err.response.data.message || 'Failed to drop item'
        } else {
          error.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    // Computed properties
    const hasEquippedItems = computed(() => {
      if (!inventory.value) return false
      return (
        (inventory.value.equippedArmor && inventory.value.equippedArmor.length > 0) ||
        (inventory.value.equippedWeapons && inventory.value.equippedWeapons.length > 0) ||
        (inventory.value.equippedJewelry && inventory.value.equippedJewelry.length > 0) ||
        (inventory.value.equippedSpellbooks && inventory.value.equippedSpellbooks.length > 0)
      )
    })

    const hasInventoryItems = computed(() => {
      if (!inventory.value) return false
      return (
        (inventory.value.armor && inventory.value.armor.length > 0) ||
        (inventory.value.weapons && inventory.value.weapons.length > 0) ||
        (inventory.value.jewelry && inventory.value.jewelry.length > 0) ||
        (inventory.value.spellbooks && inventory.value.spellbooks.length > 0)
      )
    })

    // Load initial data on component mount
    onMounted(() => {
      loadGames()
    })

    return {
      games,
      selectedGameId,
      characters,
      selectedCharacterId,
      inventoryId,
      inventory,
      characterStats,
      isLoading,
      error,
      addItemForm,
      addItemSuccess,
      hasEquippedItems,
      hasInventoryItems,
      loadGames,
      onGameChange,
      onCharacterChange,
      loadInventory,
      handleAddRandomItem,
      equipItem,
      unequipItem,
      dropItem
    }
  }
}
</script>

<style scoped>
.inventory-component {
  max-width: 1400px;
  margin: 0 auto;
}

.form-container,
.inventory-container,
.equipped-container,
.inventory-contents,
.stats-container {
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

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
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

/* Items Grid */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.item-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-card.equipped {
  border-color: #3498db;
  background: #f0f8ff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e1e4e8;
}

.item-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.item-level {
  background: #9b59b6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.item-details {
  margin-bottom: 0.75rem;
}

.item-details p {
  margin: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.item-actions button {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.9rem;
}

/* Sections */
.inventory-sections,
.equipped-items {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.inventory-section,
.equipped-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.stat-label {
  font-weight: 500;
  color: #2c3e50;
}

.stat-value {
  font-weight: 600;
  color: #3498db;
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .item-actions {
    flex-direction: column;
  }
}
</style>
