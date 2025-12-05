<template>
  <div class="login-screen">
    <div class="login-container">
      <h2>Welcome to Openworld</h2>
      <p class="subtitle">Login to start your adventure</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            ref="usernameInput"
            v-model="username"
            type="text"
            required
            placeholder="Enter your username"
            :disabled="isLoading"
            autocomplete="username"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="isLoading"
            autocomplete="current-password"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn-login">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <div class="register-section">
        <p>Don't have an account?</p>
        <button @click="navigateToRegister" class="btn-register" :disabled="isLoading">
          Create Account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'LoginScreen',
  setup() {
    // Inject game state
    const gameState = inject('gameState')

    // Form state
    const username = ref('')
    const password = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const usernameInput = ref(null)

    /**
     * Handle login form submission
     * Requirements 4.1, 7.1
     */
    const handleLogin = async () => {
      errorMessage.value = ''
      isLoading.value = true

      try {
        // Call API service login method
        const response = await apiService.login(username.value, password.value)

        // Update game state with player information
        // Requirement 3.2 - populate player property on successful login
        gameState.setPlayer({
          id: response.player, // API returns 'player' not 'playerId'
          username: username.value,
          token: response.token
        })

        // Clear form
        username.value = ''
        password.value = ''
      } catch (error) {
        // Display error message
        if (error.response) {
          errorMessage.value = error.response.data.message || 'Login failed. Please check your credentials.'
        } else if (error.request) {
          errorMessage.value = 'Network error. Please check your connection.'
        } else {
          errorMessage.value = 'An unexpected error occurred. Please try again.'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Navigate to register screen
     * Requirement 7.2
     */
    const navigateToRegister = () => {
      // Emit event to parent to show register screen
      // This will be handled by App.vue when we integrate the screen router
      window.dispatchEvent(new CustomEvent('navigate:register'))
    }

    // Auto-focus username field on mount
    onMounted(() => {
      usernameInput.value?.focus()
    })

    return {
      username,
      password,
      isLoading,
      errorMessage,
      usernameInput,
      handleLogin,
      navigateToRegister
    }
  }
}
</script>

<style scoped>
.login-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  width: 100%;
}

.login-container h2 {
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

.login-form {
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
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input {
  padding: 0.875rem;
  border: 2px solid #e1e4e8;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.btn-login {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  padding: 0.875rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 0.9rem;
  text-align: center;
}

.register-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e4e8;
  text-align: center;
}

.register-section p {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.btn-register {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}

.btn-register:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.btn-register:active:not(:disabled) {
  transform: translateY(0);
}

.btn-register:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .login-screen {
    padding: 1rem;
  }

  .login-container {
    padding: 2rem 1.5rem;
  }

  .login-container h2 {
    font-size: 1.75rem;
  }
}
</style>
