<template>
  <div class="api-log-component">
    <div class="log-header">
      <h3>API Request/Response Log</h3>
      <button @click="clearLogs" class="clear-button">Clear Logs</button>
    </div>

    <div class="log-controls">
      <label>
        <input type="checkbox" v-model="autoCull" @change="toggleAutoCull" />
        Auto-cull old log entries (max 100)
      </label>
    </div>

    <div v-if="logs.length === 0" class="no-logs">
      No API requests yet. Make some API calls to see them logged here.
    </div>

    <div v-else ref="logContainer" class="log-entries">
      <div 
        v-for="(logPair, index) in logPairs" 
        :key="index"
        class="log-entry"
        :class="{ 'error-entry': logPair.response?.isError }"
      >
        <!-- Request Section -->
        <div v-if="logPair.request" class="log-section request-section">
          <div class="section-header" @click="toggleSection(index, 'request')">
            <span class="toggle-icon">{{ expandedSections[`${index}-request`] ? '▼' : '▶' }}</span>
            <span class="timestamp">{{ formatTimestamp(logPair.request.timestamp) }}</span>
            <span class="method" :class="`method-${logPair.request.method.toLowerCase()}`">
              {{ logPair.request.method }}
            </span>
            <span class="endpoint">{{ logPair.request.endpoint }}</span>
          </div>

          <div v-if="expandedSections[`${index}-request`]" class="section-content">
            <div class="detail-group">
              <h4>Request Headers</h4>
              <pre class="json-display">{{ formatJson(logPair.request.headers) }}</pre>
            </div>

            <div v-if="logPair.request.payload" class="detail-group">
              <h4>Request Payload</h4>
              <pre class="json-display">{{ formatJson(logPair.request.payload) }}</pre>
            </div>
          </div>
        </div>

        <!-- Response Section -->
        <div v-if="logPair.response" class="log-section response-section">
          <div class="section-header" @click="toggleSection(index, 'response')">
            <span class="toggle-icon">{{ expandedSections[`${index}-response`] ? '▼' : '▶' }}</span>
            <span class="timestamp">{{ formatTimestamp(logPair.response.timestamp) }}</span>
            <span 
              class="status-code" 
              :class="getStatusClass(logPair.response.status)"
            >
              {{ logPair.response.status }} {{ logPair.response.statusText }}
            </span>
          </div>

          <div v-if="expandedSections[`${index}-response`]" class="section-content">
            <div class="detail-group">
              <h4>Response Headers</h4>
              <pre class="json-display">{{ formatJson(logPair.response.headers) }}</pre>
            </div>

            <div class="detail-group">
              <h4>Response Body</h4>
              <pre 
                class="json-display" 
                :class="{ 'error-body': logPair.response.isError }"
              >{{ formatJson(logPair.response.body) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'ApiLogComponent',
  setup() {
    const logs = ref([])
    const expandedSections = ref({})
    const autoCull = ref(true)
    const logContainer = ref(null)

    // Pair requests with their responses
    const logPairs = computed(() => {
      const pairs = []
      let currentRequest = null

      for (const log of logs.value) {
        if (log.type === 'request') {
          if (currentRequest) {
            // Previous request had no response
            pairs.push({ request: currentRequest, response: null })
          }
          currentRequest = log
        } else if (log.type === 'response') {
          if (currentRequest) {
            pairs.push({ request: currentRequest, response: log })
            currentRequest = null
          } else {
            // Response without request (shouldn't happen, but handle it)
            pairs.push({ request: null, response: log })
          }
        }
      }

      // Handle any remaining unpaired request
      if (currentRequest) {
        pairs.push({ request: currentRequest, response: null })
      }

      // Reverse the order so newest entries appear at the top
      return pairs.reverse()
    })

    // Format timestamp
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        fractionalSecondDigits: 3
      })
    }

    // Format JSON with syntax highlighting
    const formatJson = (obj) => {
      if (!obj) return 'null'
      try {
        return JSON.stringify(obj, null, 2)
      } catch (e) {
        return String(obj)
      }
    }

    // Get status code CSS class
    const getStatusClass = (status) => {
      if (status >= 200 && status < 300) return 'status-success'
      if (status >= 300 && status < 400) return 'status-redirect'
      if (status >= 400 && status < 500) return 'status-client-error'
      if (status >= 500) return 'status-server-error'
      return ''
    }

    // Toggle section expansion
    const toggleSection = (index, type) => {
      const key = `${index}-${type}`
      expandedSections.value[key] = !expandedSections.value[key]
    }

    // Clear all logs
    const clearLogs = () => {
      apiService.clearLogs()
      logs.value = []
      expandedSections.value = {}
    }

    // Load preferences from localStorage
    const loadPreferences = () => {
      try {
        const savedAutoCull = localStorage.getItem('api-log:auto-cull')
        
        if (savedAutoCull !== null) {
          autoCull.value = savedAutoCull === 'true'
          apiService.setAutoCull(autoCull.value)
        }
      } catch (error) {
        console.warn('Failed to load preferences from localStorage:', error)
        // Fall back to defaults (already set)
      }
    }

    // Toggle auto-cull preference
    const toggleAutoCull = () => {
      try {
        apiService.setAutoCull(autoCull.value)
        localStorage.setItem('api-log:auto-cull', String(autoCull.value))
      } catch (error) {
        console.warn('Failed to save auto-cull preference:', error)
      }
    }

    // Handle new log entries
    const handleNewLog = () => {
      logs.value = [...apiService.getLogs()]
    }

    onMounted(() => {
      // Load preferences from localStorage
      loadPreferences()
      
      // Load existing logs
      logs.value = [...apiService.getLogs()]
      
      // Listen for new log entries
      window.addEventListener('api:log', handleNewLog)
    })

    onUnmounted(() => {
      window.removeEventListener('api:log', handleNewLog)
    })

    return {
      logs,
      logPairs,
      expandedSections,
      autoCull,
      logContainer,
      formatTimestamp,
      formatJson,
      getStatusClass,
      toggleSection,
      clearLogs,
      toggleAutoCull
    }
  }
}
</script>

<style scoped>
.api-log-component {
  margin-top: 2rem;
  border-top: 2px solid #ecf0f1;
  padding-top: 2rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.log-header h3 {
  color: #2c3e50;
  font-size: 1.25rem;
}

.clear-button {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.clear-button:hover {
  background: #c0392b;
}

.log-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  align-items: center;
}

.log-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
  user-select: none;
  font-weight: 500;
  transition: color 0.2s;
}

.log-controls label:hover {
  color: #1a252f;
}

.log-controls input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #3498db;
}

.no-logs {
  padding: 2rem;
  text-align: center;
  color: #95a5a6;
  background: #f8f9fa;
  border-radius: 4px;
  font-style: italic;
}

.log-entries {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding: 0.25rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #fafbfc;
}

/* Custom scrollbar styling for better visibility */
.log-entries::-webkit-scrollbar {
  width: 10px;
}

.log-entries::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.log-entries::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.log-entries::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.log-entry {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  flex-shrink: 0;
  min-height: fit-content;
}

.log-entry.error-entry {
  border-color: #e74c3c;
  background: #fff5f5;
}

.log-section {
  border-bottom: 1px solid #ecf0f1;
}

.log-section:last-child {
  border-bottom: none;
}

.request-section {
  background: #f8f9fa;
}

.response-section {
  background: white;
}

.section-header {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background 0.2s;
  user-select: none;
}

.section-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.toggle-icon {
  color: #7f8c8d;
  font-size: 0.75rem;
  width: 1rem;
}

.timestamp {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #7f8c8d;
  min-width: 90px;
}

.method {
  font-weight: bold;
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  min-width: 60px;
  text-align: center;
}

.method-get {
  background: #3498db;
  color: white;
}

.method-post {
  background: #2ecc71;
  color: white;
}

.method-put {
  background: #f39c12;
  color: white;
}

.method-delete {
  background: #e74c3c;
  color: white;
}

.method-patch {
  background: #9b59b6;
  color: white;
}

.endpoint {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #2c3e50;
  flex: 1;
}

.status-code {
  font-weight: bold;
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
}

.status-success {
  background: #d4edda;
  color: #155724;
}

.status-redirect {
  background: #d1ecf1;
  color: #0c5460;
}

.status-client-error {
  background: #f8d7da;
  color: #721c24;
}

.status-server-error {
  background: #f8d7da;
  color: #721c24;
  font-weight: bold;
}

.section-content {
  padding: 1rem;
  background: white;
  border-top: 1px solid #ecf0f1;
}

.detail-group {
  margin-bottom: 1rem;
}

.detail-group:last-child {
  margin-bottom: 0;
}

.detail-group h4 {
  color: #34495e;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.json-display {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.75rem;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  overflow-x: auto;
  color: #2c3e50;
  margin: 0;
}

.json-display.error-body {
  background: #fff5f5;
  border-color: #e74c3c;
  color: #c0392b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .log-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .log-controls {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .log-controls label {
    font-size: 0.95rem;
  }

  .log-entries {
    max-height: 400px;
  }

  .section-header {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
  }

  .timestamp {
    min-width: auto;
    font-size: 0.8rem;
  }

  .method {
    min-width: auto;
    font-size: 0.8rem;
  }

  .endpoint {
    flex-basis: 100%;
    font-size: 0.85rem;
  }

  .json-display {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .api-log-component {
    padding-top: 1rem;
  }

  .log-header h3 {
    font-size: 1.1rem;
  }

  .clear-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .log-controls {
    padding: 0.5rem 0.75rem;
  }

  .log-entries {
    max-height: 300px;
  }

  .section-content {
    padding: 0.75rem;
  }

  .detail-group h4 {
    font-size: 0.85rem;
  }
}
</style>
