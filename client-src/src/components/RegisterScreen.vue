<template>
  <div class="register-screen">
    <div class="register-container">
      <h2>Create Your Account</h2>
      <p class="subtitle">Join the adventure in Openworld</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            ref="usernameInput"
            v-model="username"
            type="text"
            required
            placeholder="Choose a username"
            :disabled="isLoading"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="isLoading"
            autocomplete="email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Choose a password"
            :disabled="isLoading"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            :disabled="isLoading"
            autocomplete="new-password"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="btn-register">
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <div class="login-section">
        <p>Already have an account?</p>
        <button @click="navigateToLogin" class="btn-login" :disabled="isLoading">
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'RegisterScreen',
  setup() {
    // Inject game state
    const gameState = inject('gameState')

    // Form state
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const usernameInput = ref(null)

    /**
     * Handle registration form submission
     * Requirements 7.2, 7.3, 7.4
     */
    const handleRegister = async () => {
      errorMessage.value = ''

      // Validate password confirmation
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
      }

      // Validate password length
      if (password.value.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters long'
        return
      }

      isLoading.value = true

      try {
        // Call API service register method
        // Requirement 7.2 - register user
        await apiService.register(username.value, email.value, password.value)

        // Auto-login after successful registration
        // Requirement 7.3 - automatically log in the user
        const loginResponse = await apiService.login(username.value, password.value)

        // Update game state with player information
        // Requirement 7.4 - populate player property and navigate to game-select
        gameState.setPlayer({
          id: loginResponse.player, // API returns 'player' not 'playerId'
          username: username.value,
          token: loginResponse.token
        })

        // Clear temporary screen to trigger state-based routing
        // This will cause the app to navigate to game-select screen
        gameState.clearTempScreen()

        // Don't clear form or set isLoading to false on success
        // The component will unmount as we navigate away
      } catch (error) {
        // Only handle errors - clear loading state and show error
        isLoading.value = false
        
        // Display error message
        if (error.response) {
          errorMessage.value = error.response.data.message || 'Registration failed. Please try again.'
        } else if (error.request) {
          errorMessage.value = 'Network error. Please check your connection.'
        } else {
          errorMessage.value = 'An unexpected error occurred. Please try again.'
        }
      }
    }

    /**
     * Navigate back to login screen
     * Requirement 7.2
     */
    const navigateToLogin = () => {
      // Emit event to parent to show login screen
      // This will be handled by App.vue when we integrate the screen router
      window.dispatchEvent(new CustomEvent('navigate:login'))
    }

    // Auto-focus username field on mount
    onMounted(() => {
      usernameInput.value?.focus()
    })

    return {
      username,
      email,
      password,
      confirmPassword,
      isLoading,
      errorMessage,
      usernameInput,
      handleRegister,
      navigateToLogin
    }
  }
}
</script>

<style scoped>
.register-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.register-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  width: 100%;
}

.register-container h2 {
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

.register-form {
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

.btn-register {
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

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-register:active:not(:disabled) {
  transform: translateY(0);
}

.btn-register:disabled {
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

.login-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e4e8;
  text-align: center;
}

.login-section p {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.btn-login {
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

.btn-login:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .register-screen {
    padding: 1rem;
  }

  .register-container {
    padding: 2rem 1.5rem;
  }

  .register-container h2 {
    font-size: 1.75rem;
  }
}
</style>
