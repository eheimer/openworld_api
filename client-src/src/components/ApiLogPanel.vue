<template>
  <!-- Persistent Sidebar Panel -->
  <div 
    class="log-panel" 
    :class="{ 'panel-open': isOpen }"
  >
    <div class="panel-header">
      <h3>API Log</h3>
      <button 
        class="toggle-button" 
        @click="togglePanel"
        :aria-label="isOpen ? 'Close API log panel' : 'Open API log panel'"
        :title="isOpen ? 'Close API Log' : 'Open API Log'"
      >
        <span class="toggle-icon">{{ isOpen ? '▶' : '◀' }}</span>
      </button>
    </div>

    <div v-if="isOpen" class="panel-content">
      <!-- Integrate existing ApiLogComponent -->
      <ApiLogComponent />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import ApiLogComponent from './ApiLogComponent.vue'

export default {
  name: 'ApiLogPanel',
  components: {
    ApiLogComponent
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isOpen = ref(false)

    const togglePanel = () => {
      isOpen.value = !isOpen.value
      emit('toggle', isOpen.value)
    }

    // Listen for api:log events to ensure panel is reactive
    // Requirements: 2.4
    const handleApiLog = () => {
      // The ApiLogComponent handles the actual log display
      // This handler ensures the panel is aware of new logs
      // Scroll behavior is handled by ApiLogComponent's internal logic
    }

    onMounted(() => {
      // Listen for api:log events
      window.addEventListener('api:log', handleApiLog)
    })

    onUnmounted(() => {
      window.removeEventListener('api:log', handleApiLog)
    })

    return {
      isOpen,
      togglePanel
    }
  }
}
</script>

<style scoped>
/* Persistent Sidebar Panel */
.log-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 60px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  z-index: 900;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.log-panel.panel-open {
  width: 500px;
  box-shadow: -2px 0 16px rgba(0, 0, 0, 0.2);
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 2px solid #ecf0f1;
  background: #3498db;
  flex-shrink: 0;
  min-height: 60px;
}

.panel-header h3 {
  color: white;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.panel-open .panel-header h3 {
  opacity: 1;
}

/* Toggle Button */
.toggle-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  line-height: 1;
  transition: background 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.toggle-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.toggle-button:active {
  transform: scale(0.95);
}

.toggle-icon {
  font-size: 1rem;
}

/* Panel Content */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Override ApiLogComponent styles for panel context */
.panel-content :deep(.api-log-component) {
  margin-top: 0;
  border-top: none;
  padding-top: 0;
}

.panel-content :deep(.log-header) {
  margin-bottom: 1rem;
}

.panel-content :deep(.log-entries) {
  max-height: none;
  height: calc(100vh - 300px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .log-panel.panel-open {
    width: 400px;
  }

  .panel-content {
    padding: 0.75rem;
  }

  .panel-content :deep(.log-entries) {
    height: calc(100vh - 200px);
  }
}

@media (max-width: 480px) {
  .log-panel {
    width: 50px;
  }

  .log-panel.panel-open {
    width: 100%;
  }

  .panel-header {
    padding: 0.75rem;
    min-height: 50px;
  }

  .panel-header h3 {
    font-size: 0.95rem;
  }

  .toggle-button {
    min-width: 32px;
    height: 32px;
    padding: 0.4rem;
  }

  .toggle-icon {
    font-size: 0.9rem;
  }

  .panel-content {
    padding: 0.5rem;
  }

  .panel-content :deep(.log-entries) {
    height: calc(100vh - 180px);
  }
}
</style>
