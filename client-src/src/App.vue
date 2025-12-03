<template>
  <div id="app">
    <header>
      <h1>Openworld API Test Client</h1>
      <div v-if="authToken" class="auth-status">
        Authenticated as Player {{ playerId }}
        <button @click="logout">Logout</button>
      </div>
    </header>
    
    <nav class="navigation">
      <button 
        v-for="section in sections" 
        :key="section.id"
        :class="{ active: currentSection === section.id }"
        @click="currentSection = section.id"
      >
        {{ section.label }}
      </button>
    </nav>

    <main class="content-area">
      <div v-if="currentSection === 'auth'" class="section">
        <h2>Authentication</h2>
        <AuthComponent />
      </div>

      <div v-if="currentSection === 'games'" class="section">
        <h2>Games</h2>
        <GamesComponent />
      </div>

      <div v-if="currentSection === 'characters'" class="section">
        <h2>Characters</h2>
        <CharactersComponent />
      </div>

      <div v-if="currentSection === 'battles'" class="section">
        <h2>Battles</h2>
        <BattlesComponent />
      </div>

      <div v-if="currentSection === 'inventory'" class="section">
        <h2>Inventory</h2>
        <InventoryComponent />
      </div>

      <div v-if="currentSection === 'api-log'" class="section">
        <h2>API Request/Response Log</h2>
        <ApiLogComponent />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import apiService from './services/apiService.js'
import AuthComponent from './components/AuthComponent.vue'
import GamesComponent from './components/GamesComponent.vue'
import CharactersComponent from './components/CharactersComponent.vue'
import BattlesComponent from './components/BattlesComponent.vue'
import InventoryComponent from './components/InventoryComponent.vue'
import ApiLogComponent from './components/ApiLogComponent.vue'

export default {
  name: 'App',
  components: {
    AuthComponent,
    GamesComponent,
    CharactersComponent,
    BattlesComponent,
    InventoryComponent,
    ApiLogComponent
  },
  setup() {
    // Authentication state
    const authToken = ref(localStorage.getItem('jwt_token'))
    const playerId = ref(localStorage.getItem('player_id'))
    
    // Navigation state
    const currentSection = ref('auth')
    const sections = [
      { id: 'auth', label: 'Authentication' },
      { id: 'games', label: 'Games' },
      { id: 'characters', label: 'Characters' },
      { id: 'battles', label: 'Battles' },
      { id: 'inventory', label: 'Inventory' },
      { id: 'api-log', label: 'API Log' }
    ]

    // Watch for authentication changes and persist to localStorage
    watch(authToken, (newToken) => {
      if (newToken) {
        localStorage.setItem('jwt_token', newToken)
      } else {
        localStorage.removeItem('jwt_token')
      }
    })

    watch(playerId, (newPlayerId) => {
      if (newPlayerId) {
        localStorage.setItem('player_id', newPlayerId)
      } else {
        localStorage.removeItem('player_id')
      }
    })

    // Handle logout event from child components
    const handleLogout = () => {
      authToken.value = null
      playerId.value = null
    }

    // Handle login event from child components
    const handleLogin = (event) => {
      authToken.value = event.detail.token
      playerId.value = event.detail.playerId
    }

    const logout = () => {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('player_id')
      handleLogout()
      currentSection.value = 'auth'
    }

    onMounted(() => {
      window.addEventListener('auth:logout', handleLogout)
      window.addEventListener('auth:login', handleLogin)
    })

    onUnmounted(() => {
      window.removeEventListener('auth:logout', handleLogout)
      window.removeEventListener('auth:login', handleLogin)
    })

    return {
      authToken,
      playerId,
      currentSection,
      sections,
      logout
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
header {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.auth-status {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-status button {
  padding: 0.25rem 0.75rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.auth-status button:hover {
  background: #c0392b;
}

/* Navigation Styles */
.navigation {
  background: #34495e;
  padding: 0;
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.navigation button {
  background: transparent;
  color: #ecf0f1;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.navigation button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.navigation button.active {
  background: rgba(255, 255, 255, 0.15);
  border-bottom-color: #3498db;
  color: white;
  font-weight: 500;
}

/* Content Area Styles */
.content-area {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}

.section p {
  color: #7f8c8d;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  header {
    padding: 1rem;
  }

  header h1 {
    font-size: 1.25rem;
  }

  .navigation {
    flex-wrap: wrap;
  }

  .navigation button {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .content-area {
    padding: 1rem;
  }

  .section {
    padding: 1.5rem;
  }

  .section h2 {
    font-size: 1.5rem;
  }
}
</style>
