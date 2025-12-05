<template>
  <div class="inventory-display">
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="loading-message">
      Loading inventory...
    </div>

    <div v-else-if="!inventoryId" class="empty-message">
      No inventory found for this character.
    </div>

    <div v-else>
      <!-- Add Random Item -->
      <div class="add-item-section">
        <h4>Add Random Item</h4>
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
        <h4>Equipped Items</h4>
        <div v-if="hasEquippedItems" class="equipped-items">
          <div v-if="equippedArmor && equippedArmor.length > 0" class="equipped-section">
            <h5>Armor</h5>
            <div class="items-grid">
              <div v-for="item in equippedArmor" :key="item.id" class="item-card equipped">
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

          <div v-if="equippedWeapons && equippedWeapons.length > 0" class="equipped-section">
            <h5>Weapons</h5>
            <div class="items-grid">
              <div v-for="item in equippedWeapons" :key="item.id" class="item-card equipped">
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

          <div v-if="equippedJewelry && equippedJewelry.length > 0" class="equipped-section">
            <h5>Jewelry</h5>
            <div class="items-grid">
              <div v-for="item in equippedJewelry" :key="item.id" class="item-card equipped">
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

          <div v-if="equippedSpellbooks && equippedSpellbooks.length > 0" class="equipped-section">
            <h5>Spellbooks</h5>
            <div class="items-grid">
              <div v-for="item in equippedSpellbooks" :key="item.id" class="item-card equipped">
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
        <div class="inventory-header">
          <h4>Inventory Contents</h4>
          <button @click="loadInventory" :disabled="isLoading" class="btn-refresh">
            {{ isLoading ? 'Loading...' : '🔄 Refresh' }}
          </button>
        </div>

        <div v-if="hasInventoryItems" class="inventory-sections">
          <!-- Armor -->
          <div v-if="inventory.armor && inventory.armor.length > 0" class="inventory-section">
            <h5>Armor ({{ inventory.armor.length }})</h5>
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
                  <button 
                    v-if="item.equipped === true"
                    @click="unequipItem('armor', item.id)" 
                    :disabled="isLoading" 
                    class="btn-success">
                    Unequip
                  </button>
                  <button 
                    v-else
                    @click="equipItem('armor', item.id)" 
                    :disabled="isLoading" 
                    class="btn-primary">
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
            <h5>Weapons ({{ inventory.weapons.length }})</h5>
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
                  <button 
                    v-if="item.equipped === true"
                    @click="unequipItem('weapon', item.id)" 
                    :disabled="isLoading" 
                    class="btn-success">
                    Unequip
                  </button>
                  <button 
                    v-else
                    @click="equipItem('weapon', item.id)" 
                    :disabled="isLoading" 
                    class="btn-primary">
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
            <h5>Jewelry ({{ inventory.jewelry.length }})</h5>
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
                  <button 
                    v-if="item.equipped === true"
                    @click="unequipItem('jewelry', item.id)" 
                    :disabled="isLoading" 
                    class="btn-success">
                    Unequip
                  </button>
                  <button 
                    v-else
                    @click="equipItem('jewelry', item.id)" 
                    :disabled="isLoading" 
                    class="btn-primary">
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
            <h5>Spellbooks ({{ inventory.spellbooks.length }})</h5>
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
                  <button 
                    v-if="item.equipped === true"
                    @click="unequipItem('spellbook', item.id)" 
                    :disabled="isLoading" 
                    class="btn-success">
                    Unequip
                  </button>
                  <button 
                    v-else
                    @click="equipItem('spellbook', item.id)" 
                    :disabled="isLoading" 
                    class="btn-primary">
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
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'InventoryDisplay',
  props: {
    characterId: {
      type: Number,
      required: true
    },
    inventoryId: {
      type: Number,
      default: null
    }
  },
  setup(props) {
    // Component state
    const inventory = ref(null)
    const isLoading = ref(false)
    const errorMessage = ref('')

    // Add item form
    const addItemForm = ref({
      itemType: 'armor',
      level: 1
    })
    const addItemSuccess = ref(false)

    /**
     * Load inventory contents
     * Requirement 9.2 - use state properties for API calls
     */
    const loadInventory = async () => {
      if (!props.inventoryId) return

      errorMessage.value = ''
      isLoading.value = true

      try {
        const response = await apiService.get(`/inventory/${props.inventoryId}`)
        inventory.value = response.data
      } catch (err) {
        if (err.response) {
          errorMessage.value = err.response.data.message || 'Failed to load inventory'
        } else {
          errorMessage.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Add random item to inventory
     */
    const handleAddRandomItem = async () => {
      errorMessage.value = ''
      addItemSuccess.value = false
      isLoading.value = true

      try {
        await apiService.post(`/inventory/${props.inventoryId}/random`, {
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
          errorMessage.value = err.response.data.message || 'Failed to add item'
        } else {
          errorMessage.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Equip an item
     */
    const equipItem = async (itemType, itemId) => {
      errorMessage.value = ''
      isLoading.value = true

      try {
        await apiService.put(`/inventory/${props.inventoryId}/equip/${itemType}/${itemId}`)
        await loadInventory()
      } catch (err) {
        if (err.response) {
          errorMessage.value = err.response.data.message || 'Failed to equip item'
        } else {
          errorMessage.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Unequip an item
     */
    const unequipItem = async (itemType, itemId) => {
      errorMessage.value = ''
      isLoading.value = true

      try {
        await apiService.put(`/inventory/${props.inventoryId}/unequip/${itemType}/${itemId}`)
        await loadInventory()
      } catch (err) {
        if (err.response) {
          errorMessage.value = err.response.data.message || 'Failed to unequip item'
        } else {
          errorMessage.value = 'Network error. Please check your connection.'
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

      errorMessage.value = ''
      isLoading.value = true

      try {
        await apiService.put(`/inventory/${props.inventoryId}/drop/${itemType}/${itemId}`)
        await loadInventory()
      } catch (err) {
        if (err.response) {
          errorMessage.value = err.response.data.message || 'Failed to drop item'
        } else {
          errorMessage.value = 'Network error. Please check your connection.'
        }
      } finally {
        isLoading.value = false
      }
    }

    // Computed properties for filtering equipped items
    const equippedArmor = computed(() => {
      return inventory.value?.armor?.filter(item => item.equipped === true) || []
    })

    const equippedWeapons = computed(() => {
      return inventory.value?.weapons?.filter(item => item.equipped === true) || []
    })

    const equippedJewelry = computed(() => {
      return inventory.value?.jewelry?.filter(item => item.equipped === true) || []
    })

    const equippedSpellbooks = computed(() => {
      return inventory.value?.spellbooks?.filter(item => item.equipped === true) || []
    })

    // Computed properties
    const hasEquippedItems = computed(() => {
      return (
        equippedArmor.value.length > 0 ||
        equippedWeapons.value.length > 0 ||
        equippedJewelry.value.length > 0 ||
        equippedSpellbooks.value.length > 0
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

    // Load inventory on component mount
    onMounted(() => {
      if (props.inventoryId) {
        loadInventory()
      }
    })

    // Watch for inventory ID changes
    watch(() => props.inventoryId, (newId) => {
      if (newId) {
        loadInventory()
      }
    })

    return {
      inventory,
      isLoading,
      errorMessage,
      addItemForm,
      addItemSuccess,
      equippedArmor,
      equippedWeapons,
      equippedJewelry,
      equippedSpellbooks,
      hasEquippedItems,
      hasInventoryItems,
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
.inventory-display {
  width: 100%;
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

.success-message {
  padding: 0.75rem;
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 4px;
  color: #3c3;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1rem;
}

/* Add Item Section */
.add-item-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #e1e4e8;
  margin-bottom: 2rem;
}

.add-item-section h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
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

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
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
  background: #e9ecef;
  cursor: not-allowed;
}

/* Equipped Container */
.equipped-container,
.inventory-contents {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #e1e4e8;
  margin-bottom: 2rem;
}

.equipped-container h4,
.inventory-contents h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.equipped-section,
.inventory-section {
  margin-bottom: 1.5rem;
}

.equipped-section:last-child,
.inventory-section:last-child {
  margin-bottom: 0;
}

.equipped-section h5,
.inventory-section h5 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e1e4e8;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Items Grid */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.item-card {
  background: white;
  border: 2px solid #e1e4e8;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

.item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.item-card.equipped {
  border-color: #667eea;
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
  font-size: 0.85rem;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-success,
.btn-danger,
.btn-refresh {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
  transform: translateY(-1px);
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #229954;
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

.btn-refresh {
  background: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-refresh:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-success:disabled,
.btn-danger:disabled,
.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .item-actions {
    flex-direction: column;
  }

  .inventory-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-refresh {
    width: 100%;
  }
}
</style>
