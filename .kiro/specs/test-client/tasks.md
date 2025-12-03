# Implementation Plan

- [x] 1. Set up Vue.js project structure and build configuration
  - Create `client-src/` directory for Vue.js source code
  - Initialize npm project with Vue 3 and Vite
  - Configure Vite to build to `_static/client/` directory
  - Set up basic project structure (src/, components/, services/)
  - Create minimal `index.html` and `main.js` entry point
  - _Requirements: 1.1, 1.3, 8.1, 8.4_

- [x] 2. Configure NestJS to serve test client static files
  - Update `app.module.ts` to add ServeStaticModule configuration for `/client/` route
  - Ensure API routes take precedence over static file serving
  - Create `_static/client/` directory structure
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 2.1 Write property test for test client endpoint accessibility
  - **Property 1: Test client endpoint accessibility**
  - **Validates: Requirements 1.1**

- [x] 2.2 Write property test for static asset serving
  - **Property 2: Static asset serving**
  - **Validates: Requirements 1.3**

- [x] 3. Implement API service with authentication support
  - Create `apiService.js` with Axios configuration
  - Configure base URL to `/api`
  - Implement request interceptor to inject JWT token from localStorage
  - Implement response interceptor to handle 401 errors
  - Add request/response logging functionality
  - Create helper methods for common HTTP operations (GET, POST, PUT, DELETE)
  - _Requirements: 2.1, 2.3_

- [x] 3.1 Write unit tests for API service
  - Test token injection into request headers
  - Test error response handling
  - Test request/response logging
  - _Requirements: 2.1, 2.3_

- [x] 4. Create App component with navigation and global state
  - Create `App.vue` root component
  - Implement navigation menu for different test sections
  - Set up reactive state for authentication token and player info
  - Implement localStorage persistence for authentication token
  - Create basic layout with header, navigation, and content area
  - _Requirements: 1.2, 2.2_

- [x] 5. Implement Authentication component
  - Create `AuthComponent.vue` with login and registration forms
  - Implement login form with username/password inputs
  - Implement registration form with username/email/password inputs
  - Call `/api/auth/login` and `/api/auth/register` endpoints
  - Store JWT token and player ID on successful authentication
  - Display authentication status (logged in user)
  - Display error messages for failed authentication
  - _Requirements: 2.1, 2.4_

- [x] 6. Implement Games component
  - Create `GamesComponent.vue` for game management
  - Implement create game form
  - Implement game list display with owner information
  - Implement view game details (players, characters)
  - Implement update game name functionality
  - Implement delete game functionality
  - Implement add player to game functionality
  - Implement remove player from game functionality
  - _Requirements: 3.1, 3.2, 3.3, 7.1_

- [x] 7. Implement Characters component
  - Create `CharactersComponent.vue` for character management
  - Implement create character form with race selection dropdown
  - Implement attribute allocation inputs (strength, dexterity, intelligence)
  - Implement skill selection with level inputs
  - Fetch available races from `/api/race` endpoint
  - Fetch available skills from `/api/skills` endpoint
  - Implement view character details display
  - Implement delete character functionality
  - Display character stats and equipment
  - _Requirements: 4.1, 4.2, 4.3, 7.1_

- [x] 8. Implement Battles component
  - Create `BattlesComponent.vue` for battle management
  - Implement create battle functionality
  - Implement join battle functionality
  - Fetch available monsters from `/api/monsters` endpoint
  - Implement add monster to battle functionality
  - Implement advance battle round functionality
  - Display battle state (round number, participants, enemies)
  - Display enemy actions (actionName, actionValue)
  - Implement delete battle functionality
  - _Requirements: 5.1, 5.2, 5.3, 7.1_

- [x] 9. Implement Inventory component
  - Create `InventoryComponent.vue` for inventory management
  - Implement view inventory contents display
  - Implement add random item functionality (armor, weapons, jewelry, spellbooks)
  - Implement equip item functionality for each item type
  - Implement unequip item functionality for each item type
  - Implement drop item functionality for each item type
  - Display equipped items in separate section
  - Display character stats affected by equipment
  - _Requirements: 6.1, 6.2, 6.3, 7.1_

- [x] 10. Implement API request/response display component
  - Create `ApiLogComponent.vue` for displaying API interactions
  - Display recent API requests (method, endpoint, payload)
  - Display API responses (status code, headers, body)
  - Implement JSON syntax highlighting for request/response bodies
  - Implement error highlighting for failed requests
  - Create collapsible sections for request/response details
  - Add timestamp to each log entry
  - Limit display to most recent 20 requests
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 11. Add styling and polish to test client UI
  - Create `styles.css` with clean, functional design
  - Implement color coding for success/error states
  - Add adequate spacing and padding throughout
  - Ensure readable typography
  - Implement responsive layout for different screen sizes
  - Add visual hierarchy with headings and sections
  - Style forms with clear labels and input fields
  - Style buttons with hover states
  - _Requirements: 10.3_

- [x] 12. Build Vue.js application and verify static file serving
  - Run Vite build to compile Vue.js application to `_static/client/`
  - Verify all static assets are generated correctly
  - Start NestJS server and navigate to `/client/`
  - Verify test client loads and displays correctly
  - Test that all components are accessible via navigation
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 13. Create steering documentation for test client maintenance
  - Create `.kiro/steering/test-client-maintenance.md` file
  - Document requirements for updating test client when API changes
  - Provide guidelines for adding new test interfaces
  - Include synchronization checklist
  - Document build and deployment process
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 14. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Create integration tests for complete workflows
  - Test authentication flow (register → login → authenticated request)
  - Test game workflow (create game → add player → create character)
  - Test battle workflow (create battle → add monster → advance round)
  - Test inventory workflow (add item → equip → unequip → drop)
  - _Requirements: 7.1_

- [x] 16. Perform manual testing of test client
  - Verify all API endpoints are accessible through test client
  - Test error handling for invalid inputs
  - Verify request/response display shows correct information
  - Test authentication flow end-to-end
  - Test all game management operations
  - Test all character management operations
  - Test all battle operations
  - Test all inventory operations
  - Verify UI is responsive and usable
  - _Requirements: 7.1, 10.1, 10.2, 10.3_
