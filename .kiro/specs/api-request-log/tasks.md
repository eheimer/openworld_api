# Implementation Plan

- [x] 1. Fix ApiService log ordering and configuration
  - Modify `apiService.js` to use `push()` instead of `unshift()` for chronological ordering
  - Change `maxLogs` from 20 to 100
  - Add `autoCullEnabled` property (default: true)
  - Add `setAutoCull(enabled)` method to control culling behavior
  - Update `addLog()` method to respect `autoCullEnabled` flag when removing old entries
  - _Requirements: 1.4, 4.1, 4.2, 4.3_

- [ ]* 1.1 Write property test for request logging completeness
  - **Property 1: Request logging completeness**
  - **Validates: Requirements 1.1**

- [ ]* 1.2 Write property test for response logging completeness
  - **Property 2: Response logging completeness**
  - **Validates: Requirements 1.2**

- [ ]* 1.3 Write property test for log chronological ordering
  - **Property 4: Log chronological ordering**
  - **Validates: Requirements 1.4**

- [ ]* 1.4 Write property test for auto-cull maintains maximum size
  - **Property 8: Auto-cull maintains maximum size**
  - **Validates: Requirements 4.1, 4.2**

- [ ]* 1.5 Write property test for auto-cull disabled allows growth
  - **Property 9: Auto-cull disabled allows growth**
  - **Validates: Requirements 4.3, 5.3**

- [ ]* 1.6 Write unit tests for ApiService modifications
  - Test `setAutoCull()` method
  - Test that `push()` maintains chronological order
  - Test that maxLogs is respected when auto-cull is enabled
  - Test that maxLogs is ignored when auto-cull is disabled
  - _Requirements: 1.4, 4.1, 4.2, 4.3_

- [x] 2. Add user preference controls to ApiLogComponent
  - Add reactive state variables: `autoScroll` (default: true), `autoCull` (default: true)
  - Add `logContainer` ref for the scrollable container element
  - Create `loadPreferences()` method to load settings from localStorage on mount
  - Create `toggleAutoScroll()` method to toggle preference and persist to localStorage
  - Create `toggleAutoCull()` method to toggle preference, update apiService, and persist to localStorage
  - Add controls section to template with two labeled checkboxes above log entries
  - Add `ref="logContainer"` to the log entries container div
  - _Requirements: 2.4, 3.1, 3.2, 4.4, 5.1, 5.2_

- [ ]* 2.1 Write unit tests for preference loading and saving
  - Test `loadPreferences()` loads from localStorage
  - Test `loadPreferences()` falls back to defaults when localStorage is empty
  - Test `toggleAutoScroll()` saves to localStorage
  - Test `toggleAutoCull()` saves to localStorage and updates apiService
  - Test localStorage error handling
  - _Requirements: 2.4, 4.4_

- [x] 3. Implement auto-scroll functionality
  - Create `scrollToBottom()` method that scrolls logContainer to bottom
  - Add null check in `scrollToBottom()` for logContainer ref
  - Modify `handleNewLog()` to call `scrollToBottom()` after DOM update when `autoScroll` is true
  - Use Vue's `nextTick()` to ensure DOM updates before scrolling
  - Update CSS for `.log-entries` to have `max-height: 600px` and `overflow-y: auto`
  - _Requirements: 2.1, 2.2, 2.3, 3.3_

- [ ]* 3.1 Write property test for auto-scroll activates on new entry
  - **Property 5: Auto-scroll activates on new entry**
  - **Validates: Requirements 2.1, 2.2**

- [ ]* 3.2 Write property test for auto-scroll disabled preserves position
  - **Property 6: Auto-scroll disabled preserves position**
  - **Validates: Requirements 2.3, 3.3**

- [ ]* 3.3 Write unit tests for scroll functionality
  - Test `scrollToBottom()` sets correct scroll position
  - Test `scrollToBottom()` handles null container reference
  - Test that scroll occurs when autoScroll is true
  - Test that scroll is skipped when autoScroll is false
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. Add CSS styling for controls and scrollable container
  - Style `.log-controls` section with flexbox layout and spacing
  - Style checkbox labels for readability
  - Ensure controls are positioned above log entries
  - Verify scrollbar appears when content overflows
  - Test responsive behavior on mobile viewports
  - _Requirements: 3.1, 5.1, 6.1_

- [ ]* 4.1 Write property test for log entry visibility
  - **Property 3: Log entry visibility**
  - **Validates: Requirements 1.3**

- [ ]* 4.2 Write property test for checkbox toggles behavior
  - **Property 7: Checkbox toggles behavior**
  - **Validates: Requirements 3.2, 5.2**

- [ ] 5. Integration testing and manual verification
  - Verify complete flow: make API call → log populates → auto-scroll occurs → auto-cull at 100
  - Test checkbox interactions change behavior correctly
  - Test preference persistence across page reloads
  - Test with various API endpoints (GET, POST, PUT, DELETE)
  - Test error responses are logged correctly
  - Verify log ordering is chronological
  - Verify scrollbar appears and functions correctly
  - _Requirements: All_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
