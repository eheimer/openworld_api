# Design Document

## Overview

The API Request/Response Log is a critical debugging and testing tool within the test client that displays HTTP request/response pairs in a user-friendly format. The current implementation has several issues:

1. **Log ordering issue**: Logs are added with `unshift()` (newest first) but the component expects chronological order (oldest first)
2. **Missing auto-scroll functionality**: No automatic scrolling to new entries
3. **Fixed log limit**: Hardcoded to 20 entries instead of the required 100
4. **No user controls**: Missing checkboxes for auto-scroll and auto-cull behaviors

This design addresses these issues by fixing the log ordering, implementing configurable auto-scroll and auto-cull features, and ensuring the log maintains optimal performance during extended testing sessions.

## Architecture

The solution follows Vue 3's Composition API pattern with reactive state management. The architecture consists of:

1. **ApiService** (existing): Singleton service that intercepts axios requests/responses and maintains the log array
2. **ApiLogComponent** (existing): Vue component that displays logs with collapsible sections
3. **Event-driven updates**: Custom events (`api:log`) trigger UI updates when new logs arrive
4. **LocalStorage persistence**: User preferences for auto-scroll and auto-cull are persisted across sessions

### Data Flow

```
API Call → Axios Interceptor → ApiService.logRequest/logResponse → 
Event Dispatch → ApiLogComponent receives event → Update reactive state → 
Apply auto-scroll/auto-cull → Render updated UI
```

## Components and Interfaces

### ApiService Modifications

**Current Issues:**
- Uses `unshift()` which adds to beginning of array (reverse chronological)
- `maxLogs` is 20 instead of 100
- No configuration for disabling auto-cull

**Required Changes:**
- Change `unshift()` to `push()` for chronological ordering
- Change `maxLogs` from 20 to 100
- Add `autoCullEnabled` property (default: true)
- Modify `addLog()` to respect `autoCullEnabled` flag
- Add `setAutoCull(enabled)` method

### ApiLogComponent Modifications

**New State Variables:**
- `autoScroll` (ref, boolean, default: true) - Controls auto-scroll behavior
- `autoCull` (ref, boolean, default: true) - Controls auto-cull behavior
- `logContainer` (ref, DOM element) - Reference to scrollable log container

**New Methods:**
- `scrollToBottom()` - Scrolls log container to show newest entry
- `toggleAutoScroll()` - Toggles auto-scroll preference and persists to localStorage
- `toggleAutoCull()` - Toggles auto-cull preference, updates apiService, persists to localStorage
- `loadPreferences()` - Loads user preferences from localStorage on mount

**Template Changes:**
- Add controls section above log entries with two checkboxes
- Add `ref="logContainer"` to scrollable container
- Update container to have fixed height with overflow-y: auto

### LocalStorage Keys

- `api-log:auto-scroll` - Boolean string ("true"/"false")
- `api-log:auto-cull` - Boolean string ("true"/"false")

## Data Models

### Log Entry Structure (unchanged)

```typescript
interface LogEntry {
  timestamp: Date
  type: 'request' | 'response'
  
  // Request-specific fields
  method?: string          // 'GET', 'POST', etc.
  endpoint?: string        // '/games', '/battles/123'
  payload?: any           // Request body
  
  // Response-specific fields
  status?: number         // 200, 404, 500, etc.
  statusText?: string     // 'OK', 'Not Found', etc.
  body?: any             // Response body
  isError?: boolean      // true if error response
  
  // Common fields
  headers: object        // HTTP headers
}
```

### User Preferences

```typescript
interface LogPreferences {
  autoScroll: boolean    // Default: true
  autoCull: boolean      // Default: true
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Request logging completeness

*For any* API request sent from the test client, the log should contain an entry with the request method, URL, and body populated.

**Validates: Requirements 1.1**

### Property 2: Response logging completeness

*For any* API response received, the log should contain an entry with the response status code, body, and timestamp populated.

**Validates: Requirements 1.2**

### Property 3: Log entry visibility

*For any* log entry created, the entry should be displayed in the API Request/Response Log component.

**Validates: Requirements 1.3**

### Property 4: Log chronological ordering

*For any* sequence of API requests and responses, the log entries should appear in chronological order with the oldest entry first and the newest entry last.

**Validates: Requirements 1.4**

### Property 5: Auto-scroll activates on new entry

*For any* log state where auto-scroll is enabled, when a new log entry is added, the scroll position should be at the bottom of the log container showing the newest entry.

**Validates: Requirements 2.1, 2.2**

### Property 6: Auto-scroll disabled preserves position

*For any* log state where auto-scroll is disabled, when a new log entry is added, the scroll position should remain unchanged from before the entry was added.

**Validates: Requirements 2.3, 3.3**

### Property 7: Checkbox toggles behavior

*For any* checkbox (auto-scroll or auto-cull), when clicked, the corresponding behavior should toggle from enabled to disabled or vice versa.

**Validates: Requirements 3.2, 5.2**

### Property 8: Auto-cull maintains maximum size

*For any* log state where auto-cull is enabled and the log contains 100 entries, when a new entry is added, the log should contain exactly 100 entries with the oldest entry removed.

**Validates: Requirements 4.1, 4.2**

### Property 9: Auto-cull disabled allows growth

*For any* log state where auto-cull is disabled, when entries are added beyond 100, all entries should be retained in the log.

**Validates: Requirements 4.3, 5.3**

## Error Handling

### LocalStorage Errors

If localStorage is unavailable (private browsing, quota exceeded):
- Catch exceptions in `loadPreferences()` and `toggleAutoScroll()`/`toggleAutoCull()`
- Fall back to default values (both enabled)
- Log warning to console
- Continue operation without persistence

### Scroll Container Reference Errors

If `logContainer` ref is null when `scrollToBottom()` is called:
- Check for null before accessing `scrollTop` or `scrollHeight`
- Silently skip scroll operation
- This can occur during component initialization before DOM is ready

### Event Listener Cleanup

- Remove event listeners in `onUnmounted()` to prevent memory leaks
- Use the same function reference for both `addEventListener` and `removeEventListener`

## Testing Strategy

### Unit Testing

Unit tests will verify specific behaviors and edge cases:

1. **ApiService log ordering**
   - Test that logs are added in chronological order with `push()`
   - Test that oldest logs are removed when limit is reached
   - Test that auto-cull can be disabled

2. **Preference persistence**
   - Test loading preferences from localStorage
   - Test saving preferences to localStorage
   - Test fallback to defaults when localStorage fails

3. **Scroll behavior**
   - Test that `scrollToBottom()` sets correct scroll position
   - Test that scroll is skipped when auto-scroll is disabled
   - Test that scroll handles null container reference

### Property-Based Testing

Property-based tests will verify universal properties across many inputs using Vitest with the `fast-check` library. Each test will run a minimum of 100 iterations.

1. **Property 1: Request logging completeness**
   - Generate random API requests with varying methods, URLs, and bodies
   - Add them to apiService
   - Verify each log entry contains method, URL, and body fields

2. **Property 2: Response logging completeness**
   - Generate random API responses with varying status codes, bodies, and timestamps
   - Add them to apiService
   - Verify each log entry contains status, body, and timestamp fields

3. **Property 3: Log entry visibility**
   - Generate random log entries
   - Add them to the component
   - Verify they appear in the rendered output

4. **Property 4: Log chronological ordering**
   - Generate random sequences of log entries with timestamps
   - Add them to apiService
   - Verify timestamps are in ascending order

5. **Property 5: Auto-scroll activates on new entry**
   - Generate random log states with auto-scroll enabled
   - Add new entry and trigger scroll
   - Verify scroll position equals scrollHeight - clientHeight

6. **Property 6: Auto-scroll disabled preserves position**
   - Generate random log states with auto-scroll disabled
   - Record scroll position before adding entry
   - Verify scroll position unchanged after adding entry

7. **Property 7: Checkbox toggles behavior**
   - Generate random initial checkbox states
   - Toggle the checkbox
   - Verify behavior changes from enabled to disabled or vice versa

8. **Property 8: Auto-cull maintains maximum size**
   - Generate random log arrays of size 100
   - Add new entries with auto-cull enabled
   - Verify log length remains 100 and oldest entry is removed

9. **Property 9: Auto-cull disabled allows growth**
   - Generate random log arrays of varying sizes
   - Add entries beyond 100 with auto-cull disabled
   - Verify log length increases without bound

### Integration Testing

Integration tests will verify the complete flow:

1. **End-to-end log flow**
   - Make API call through apiService
   - Verify log entry appears in component
   - Verify auto-scroll occurs if enabled
   - Verify auto-cull occurs if enabled and limit reached

2. **User interaction flow**
   - Toggle checkboxes
   - Make API calls
   - Verify behaviors change according to checkbox state
   - Reload page and verify preferences persist

### Manual Testing

Manual testing checklist:

1. Open test client and navigate to API Log section
2. Verify both checkboxes are checked by default
3. Make several API calls and verify log populates
4. Verify log auto-scrolls to show newest entries
5. Uncheck auto-scroll, scroll to top, make API call
6. Verify scroll position doesn't change
7. Make 100+ API calls with auto-cull enabled
8. Verify log stays at 100 entries
9. Uncheck auto-cull, make more calls
10. Verify log grows beyond 100
11. Reload page and verify checkbox states persist
12. Clear logs and verify log empties

## Implementation Notes

### Scroll Timing

Auto-scroll must occur after the DOM has updated with the new log entry. Use `nextTick()` from Vue to ensure DOM updates complete before scrolling:

```javascript
import { nextTick } from 'vue'

const handleNewLog = async () => {
  logs.value = [...apiService.getLogs()]
  if (autoScroll.value) {
    await nextTick()
    scrollToBottom()
  }
}
```

### CSS for Scrollable Container

The log entries container needs fixed height and overflow:

```css
.log-entries {
  max-height: 600px;
  overflow-y: auto;
  /* ... other styles ... */
}
```

### Checkbox Styling

Checkboxes should be clearly visible and labeled:

```html
<div class="log-controls">
  <label>
    <input type="checkbox" v-model="autoScroll" @change="toggleAutoScroll" />
    Auto-scroll to new entry
  </label>
  <label>
    <input type="checkbox" v-model="autoCull" @change="toggleAutoCull" />
    Auto-cull old log entries (max 100)
  </label>
</div>
```

### Performance Considerations

- Use `v-for` with `:key` for efficient list rendering
- Avoid unnecessary re-renders by using computed properties
- Keep log limit at 100 to prevent memory issues
- Use event delegation where possible

## Future Enhancements

Potential improvements not included in this design:

1. **Export logs**: Allow downloading logs as JSON or CSV
2. **Filter logs**: Filter by method, status code, or endpoint
3. **Search logs**: Search log content by keyword
4. **Configurable log limit**: Allow user to set custom max log size
5. **Log persistence**: Save logs to localStorage for review after page reload
6. **Timestamps relative to first entry**: Show elapsed time since first log
7. **Request/response diff**: Highlight differences between similar requests
