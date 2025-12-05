<template>
  <div class="hamburger-menu-container">
    <!-- Hamburger Icon Button -->
    <button 
      class="hamburger-icon" 
      @click="toggleMenu"
      aria-label="Toggle navigation menu"
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>

    <!-- Backdrop (click outside to close) -->
    <div 
      v-if="isOpen" 
      class="menu-backdrop" 
      @click="closeMenu"
    ></div>

    <!-- Slide-out Menu Panel -->
    <div 
      class="menu-panel" 
      :class="{ 'menu-open': isOpen }"
    >
      <div class="menu-header">
        <h3>Navigation</h3>
        <button 
          class="close-button" 
          @click="closeMenu"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav class="menu-items">
        <button
          v-for="option in menuOptions"
          :key="option.id"
          class="menu-item"
          @click="handleOptionClick(option.id)"
        >
          <span class="menu-icon">{{ option.icon }}</span>
          <span class="menu-label">{{ option.label }}</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'

export default {
  name: 'HamburgerMenu',
  emits: ['option-selected'],
  setup(props, { emit }) {
    // Inject gameState from parent (App.vue)
    // Requirements 8.1, 8.2, 8.3, 8.4
    const gameState = inject('gameState')
    
    const isOpen = ref(false)

    const toggleMenu = () => {
      isOpen.value = !isOpen.value
    }

    const closeMenu = () => {
      isOpen.value = false
    }

    const handleOptionClick = (optionId) => {
      // Emit event for menu option selection
      // Requirement 8.1, 8.2, 8.3, 8.4
      emit('option-selected', optionId)
      closeMenu()
    }

    return {
      isOpen,
      toggleMenu,
      closeMenu,
      handleOptionClick,
      // Use computed menuOptions from state
      menuOptions: gameState.menuOptions
    }
  }
}
</script>

<style scoped>
.hamburger-menu-container {
  position: relative;
  z-index: 1000;
}

/* Hamburger Icon Button - Requirement 1.2: smooth animations */
.hamburger-icon {
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 3rem;
  height: 3rem;
  background: #3498db;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem;
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1001;
}

.hamburger-icon:hover {
  background: #2980b9;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hamburger-icon:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.hamburger-line {
  width: 1.5rem;
  height: 0.2rem;
  background: white;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop - Requirement 1.2: fade-in animation */
.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: backdropFadeIn 0.3s ease forwards;
}

@keyframes backdropFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Menu Panel - Requirement 1.2: slide-in transition from left with smooth animations */
.menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: white;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.menu-panel.menu-open {
  transform: translateX(0);
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.2);
}

/* Menu Header */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  border-bottom: 2px solid #ecf0f1;
  background: #f8f9fa;
}

.menu-header h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  margin: 0;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #2c3e50;
}

/* Menu Items */
.menu-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
  font-size: 1rem;
  color: #2c3e50;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item:active {
  background: #ecf0f1;
}

.menu-icon {
  font-size: 1.5rem;
  width: 2rem;
  text-align: center;
}

.menu-label {
  font-weight: 500;
  flex: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-panel {
    width: 240px;
  }

  .hamburger-icon {
    width: 2.5rem;
    height: 2.5rem;
    gap: 0.3rem;
  }

  .hamburger-line {
    width: 1.25rem;
    height: 0.18rem;
  }

  .menu-header {
    padding: 1rem 0.75rem;
  }

  .menu-header h3 {
    font-size: 1.1rem;
  }

  .menu-item {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }

  .menu-icon {
    font-size: 1.25rem;
    width: 1.75rem;
  }
}

@media (max-width: 480px) {
  .menu-panel {
    width: 200px;
  }

  .hamburger-icon {
    top: 0.75rem;
    left: 0.75rem;
    width: 2.25rem;
    height: 2.25rem;
  }

  .hamburger-line {
    width: 1.1rem;
  }

  .menu-header {
    padding: 0.875rem 0.625rem;
  }

  .menu-header h3 {
    font-size: 1rem;
  }

  .menu-item {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
    gap: 0.75rem;
  }

  .menu-icon {
    font-size: 1.1rem;
    width: 1.5rem;
  }
}
</style>
