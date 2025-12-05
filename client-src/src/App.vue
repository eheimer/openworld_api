<template>
  <div id="app">
    <!-- Hamburger Menu - Requirement 1.1 -->
    <HamburgerMenu @option-selected="handleMenuOption" />
    
    <!-- API Log Panel - Requirement 2.1 -->
    <ApiLogPanel @toggle="handleApiLogToggle" />
    
    <!-- Screen Router - conditionally render based on currentScreen -->
    <!-- Requirements 4.1, 4.2, 4.3, 4.4, 4.5 -->
    <main class="content-area" :class="{ 'with-api-log': apiLogOpen }">
      <!-- Login Screen - Requirement 4.1 -->
      <LoginScreen v-if="gameState.currentScreen.value === 'login'" />
      
      <!-- Register Screen - shown when navigating from login -->
      <RegisterScreen v-else-if="gameState.currentScreen.value === 'register'" />
      
      <!-- Game Select Screen - Requirement 4.2 -->
      <GameSelectScreen v-else-if="gameState.currentScreen.value === 'game-select'" />
      
      <!-- Game Create Screen - shown when creating a game -->
      <GameCreateScreen v-else-if="gameState.currentScreen.value === 'game-create'" />
      
      <!-- Character Create Screen - Requirement 4.3 -->
      <CharacterCreateScreen v-else-if="gameState.currentScreen.value === 'character-create'" />
      
      <!-- Character Screen - Requirement 4.4 -->
      <CharacterScreen v-else-if="gameState.currentScreen.value === 'character'" />
      
      <!-- Battle Create Screen - shown when creating a battle -->
      <BattleCreateScreen v-else-if="gameState.currentScreen.value === 'battle-create'" />
      
      <!-- Battle Screen - Requirement 4.5 -->
      <BattleScreen v-else-if="gameState.currentScreen.value === 'battle'" />
    </main>
  </div>
</template>

<script>
import { provide, ref, onMounted, onUnmounted } from 'vue'
import { useGameState } from './composables/useGameState.js'
import apiService from './services/apiService.js'
import HamburgerMenu from './components/HamburgerMenu.vue'
import ApiLogPanel from './components/ApiLogPanel.vue'
import LoginScreen from './components/LoginScreen.vue'
import RegisterScreen from './components/RegisterScreen.vue'
import GameSelectScreen from './components/GameSelectScreen.vue'
import GameCreateScreen from './components/GameCreateScreen.vue'
import CharacterCreateScreen from './components/CharacterCreateScreen.vue'
import CharacterScreen from './components/CharacterScreen.vue'
import BattleCreateScreen from './components/BattleCreateScreen.vue'
import BattleScreen from './components/BattleScreen.vue'

export default {
  name: 'App',
  components: {
    HamburgerMenu,
    ApiLogPanel,
    LoginScreen,
    RegisterScreen,
    GameSelectScreen,
    GameCreateScreen,
    CharacterCreateScreen,
    CharacterScreen,
    BattleCreateScreen,
    BattleScreen
  },
  setup() {
    // Setup game state management
    // Requirement 3.1 - create state object with player, game, character, battle properties
    const gameState = useGameState()

    // Track API log panel state
    const apiLogOpen = ref(false)

    // Provide gameState to all child components
    // This allows any child component to inject and use the game state
    provide('gameState', gameState)

    // Handle navigation events from screens
    const handleNavigateRegister = () => {
      gameState.navigateTo('register')
    }

    const handleNavigateLogin = () => {
      gameState.clearTempScreen()
    }

    const handleNavigateGameCreate = () => {
      gameState.navigateTo('game-create')
    }

    const handleNavigateBattleCreate = () => {
      gameState.navigateTo('battle-create')
    }

    // Handle API log panel toggle
    const handleApiLogToggle = (isOpen) => {
      apiLogOpen.value = isOpen
    }

    // Handle menu option selection
    // Requirement 8.5
    const handleMenuOption = async (optionId) => {
      switch (optionId) {
        case 'logout':
          // Clear all state and navigate to login
          gameState.logout()
          break
        
        case 'select-game':
          // Clear game, character, and battle
          gameState.setGame(null)
          gameState.setCharacter(null)
          gameState.setBattle(null)
          gameState.clearTempScreen()
          break
        
        case 'character':
          // Clear character and battle, then let state-based routing decide
          // If character exists for current game, will show character screen
          // If no character exists, will show character-create screen
          gameState.setCharacter(null)
          gameState.setBattle(null)
          gameState.clearTempScreen()
          // Trigger auto-load to check if character exists
          if (gameState.state.game && gameState.state.player) {
            await gameState.autoLoadCharacter(
              apiService,
              gameState.state.game.id,
              gameState.state.player.id
            )
          }
          break
        
        case 'leave-battle':
          // Clear battle only
          gameState.setBattle(null)
          gameState.clearTempScreen()
          break
        
        case 'login':
          // Navigate to login (clear temp screen)
          gameState.clearTempScreen()
          break
        
        default:
          console.warn('Unknown menu option:', optionId)
      }
    }

    onMounted(() => {
      window.addEventListener('navigate:register', handleNavigateRegister)
      window.addEventListener('navigate:login', handleNavigateLogin)
      window.addEventListener('navigate:game-create', handleNavigateGameCreate)
      window.addEventListener('navigate:battle-create', handleNavigateBattleCreate)
    })

    onUnmounted(() => {
      window.removeEventListener('navigate:register', handleNavigateRegister)
      window.removeEventListener('navigate:login', handleNavigateLogin)
      window.removeEventListener('navigate:game-create', handleNavigateGameCreate)
      window.removeEventListener('navigate:battle-create', handleNavigateBattleCreate)
    })

    return {
      gameState,
      apiLogOpen,
      handleApiLogToggle,
      handleMenuOption
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
  position: relative;
}

/* Content Area Styles - Updated for new layout without old navigation bar */
.content-area {
  flex: 1;
  width: calc(100% - 60px); /* Account for collapsed API log panel */
  min-height: 100vh;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* No padding here - screens handle their own layout */
}

.content-area.with-api-log {
  width: calc(100% - 500px); /* Account for expanded API log panel */
}

/* Screen Transition Animations */
.content-area > * {
  animation: screenFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes screenFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-area {
    min-height: 100vh;
  }
}

/* Mobile-specific adjustments for hamburger menu and API log panel */
@media (max-width: 768px) {
  .content-area.with-api-log {
    width: calc(100% - 400px);
  }
}

@media (max-width: 480px) {
  .content-area {
    width: calc(100% - 50px);
    padding-top: 4rem;
  }

  .content-area.with-api-log {
    width: 0;
    overflow: hidden;
  }
}
</style>
