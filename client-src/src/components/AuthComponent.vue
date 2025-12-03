<template>
  <div class="auth-component">
    <div class="auth-forms">
      <!-- Login Form -->
      <div class="form-container">
        <h3>Login</h3>
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="login-username">Username</label>
            <input
              id="login-username"
              v-model="loginForm.username"
              type="text"
              required
              placeholder="Enter username"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label for="login-password">Password</label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="Enter password"
              :disabled="isLoading"
            />
          </div>

          <button type="submit" :disabled="isLoading" class="btn-primary">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>

          <div v-if="loginError" class="error-message">
            {{ loginError }}
          </div>
        </form>
      </div>

      <!-- Registration Form -->
      <div class="form-container">
        <h3>Register</h3>
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="register-username">Username</label>
            <input
              id="register-username"
              v-model="registerForm.username"
              type="text"
              required
              placeholder="Choose username"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="register-email">Email</label>
            <input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              required
              placeholder="Enter email"
              :disabled="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label for="register-password">Password</label>
            <input
              id="register-password"
              v-model="registerForm.password"
              type="password"
              required
              placeholder="Choose password"
              :disabled="isLoading"
            />
          </div>

          <button type="submit" :disabled="isLoading" class="btn-primary">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>

          <div v-if="registerError" class="error-message">
            {{ registerError }}
          </div>

          <div v-if="registerSuccess" class="success-message">
            Registration successful! You can now login.
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'AuthComponent',
  setup() {
    // Login form state
    const loginForm = ref({
      username: '',
      password: ''
    })
    const loginError = ref('')

    // Register form state
    const registerForm = ref({
      username: '',
      email: '',
      password: ''
    })
    const registerError = ref('')
    const registerSuccess = ref(false)

    // Loading state
    const isLoading = ref(false)

    /**
     * Handle login form submission
     */
    const handleLogin = async () => {
      loginError.value = ''
      isLoading.value = true

      try {
        const response = await apiService.post('/auth/login', {
          username: loginForm.value.username,
          password: loginForm.value.password
        })

        // Store JWT token and player ID
        const { token, player } = response.data
        localStorage.setItem('jwt_token', token)
        localStorage.setItem('player_id', player)

        // Emit login event for App component
        window.dispatchEvent(new CustomEvent('auth:login', {
          detail: { token, playerId: player }
        }))

        // Clear form
        loginForm.value.username = ''
        loginForm.value.password = ''
      } catch (error) {
        // Display error message
        if (error.response) {
          loginError.value = error.response.data.message || 'Login failed'
        } else if (error.request) {
          loginError.value = 'Network error. Please check your connection.'
        } else {
          loginError.value = 'An unexpected error occurred'
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * Handle registration form submission
     */
    const handleRegister = async () => {
      registerError.value = ''
      registerSuccess.value = false
      isLoading.value = true

      try {
        await apiService.post('/auth/register', {
          username: registerForm.value.username,
          email: registerForm.value.email,
          password: registerForm.value.password
        })

        // Show success message
        registerSuccess.value = true

        // Clear form
        registerForm.value.username = ''
        registerForm.value.email = ''
        registerForm.value.password = ''
      } catch (error) {
        // Display error message
        if (error.response) {
          registerError.value = error.response.data.message || 'Registration failed'
        } else if (error.request) {
          registerError.value = 'Network error. Please check your connection.'
        } else {
          registerError.value = 'An unexpected error occurred'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      loginForm,
      loginError,
      registerForm,
      registerError,
      registerSuccess,
      isLoading,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style scoped>
.auth-component {
  max-width: 1200px;
  margin: 0 auto;
}

.auth-forms {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.form-container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
}

.form-container h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group input:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

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

@media (max-width: 900px) {
  .auth-forms {
    grid-template-columns: 1fr;
  }
}
</style>
