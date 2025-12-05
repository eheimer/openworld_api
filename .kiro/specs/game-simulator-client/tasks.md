# Implementation Plan

- [x] 1. Create state management composable
- [x] 1.1 Create useGameState composable with reactive state object
  - Implement state object with player, game, character, battle properties
  - Add computed property for current screen based on state
  - Add computed property for menu options based on state
  - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4, 4.5, 8.1, 8.2, 8.3, 8.4_

- [x] 1.2 Implement state mutation methods
  - Create setPlayer, setGame, setCharacter, setBattle methods
  - Create clearState and logout methods
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 8.5_

- [x] 1.3 Add localStorage persistence
  - Implement state serialization to localStorage on changes
  - Implement state restoration from localStorage on load
  - Add debouncing to avoid excessive writes
  - Handle corrupted data with fallback to empty state
  - _Requirements: 3.6, 3.7_

- [x] 1.4 Implement auto-load functions
  - Create autoLoadCharacter function to query API when game is selected
  - Create autoLoadBattle function to query API when character is loaded
  - _Requirements: 6.1, 6.2, 10.4_

- [ ]* 1.5 Write property tests for state management
  - **Property 1: State persistence on change**
  - **Validates: Requirements 3.6**
  - **Property 2: State restoration on load**
  - **Validates: Requirements 3.7**
  - **Property 13: Login updates state**
  - **Validates: Requirements 3.2**
  - **Property 15: Logout clears state**
  - **Validates: Requirements 8.5**
  - **Property 17: Game selection updates state**
  - **Validates: Requirements 3.3**
  - **Property 18: Character creation updates state**
  - **Validates: Requirements 3.4**
  - **Property 19: Battle creation updates state**
  - **Validates: Requirements 3.5**
  - **Property 20: Battle end clears state**
  - **Validates: Requirements 10.3**

- [ ]* 1.6 Write unit tests for state management
  - Test state initialization
  - Test each mutation method
  - Test localStorage serialization/deserialization
  - Test auto-load functions with mocked API

- [x] 2. Extend API service with helper methods
- [x] 2.1 Add authentication helper methods
  - Implement login(username, password) method
  - Implement register(username, password) method
  - _Requirements: 7.3, 7.4_

- [x] 2.2 Add game management helper methods
  - Implement getGames(playerId) method
  - Implement createGame(name, ownerId) method
  - _Requirements: 5.1, 5.4_

- [x] 2.3 Add character management helper methods
  - Implement getCharactersByGame(gameId, playerId) method
  - Implement createCharacter(data) method
  - _Requirements: 6.1, 6.2_

- [x] 2.4 Add battle management helper methods
  - Implement getActiveBattle(characterId) method
  - Implement createBattle(characterId, monsterId) method
  - Implement endBattle(battleId) method
  - _Requirements: 10.1, 10.3, 10.4_

- [ ]* 2.5 Write unit tests for API service extensions
  - Test each new helper method
  - Mock axios responses
  - Verify correct endpoints and parameters

- [x] 3. Create HamburgerMenu component
- [x] 3.1 Implement HamburgerMenu component structure
  - Create component with icon button
  - Add slide-out menu panel
  - Implement menu item rendering from props
  - Add click-outside-to-close behavior
  - Add CSS transitions for slide-in animation
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3.2 Integrate HamburgerMenu with state
  - Inject gameState
  - Use computed menuOptions from state
  - Emit events for menu option selection
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 3.3 Write property tests for HamburgerMenu
  - **Property 5: Menu option context sensitivity**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**
  - **Property 6: Menu interaction closes menu**
  - **Validates: Requirements 1.4**
  - **Property 7: Click outside closes menu**
  - **Validates: Requirements 1.3**
  - **Property 9: Hamburger menu toggle behavior**
  - **Validates: Requirements 1.2**

- [ ]* 3.4 Write unit tests for HamburgerMenu
  - Test menu rendering with different options
  - Test click handlers
  - Test animation states

- [x] 4. Create ApiLogPanel component
- [x] 4.1 Implement ApiLogPanel component structure
  - Create slide-out panel component
  - Add toggle button
  - Integrate existing ApiLogComponent
  - Add CSS transitions for slide-in animation from right
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4.2 Wire ApiLogPanel to apiService
  - Listen for api:log events
  - Display logs in panel
  - Implement scroll behavior
  - _Requirements: 2.4_

- [ ]* 4.3 Write property tests for ApiLogPanel
  - **Property 8: API log toggle behavior**
  - **Validates: Requirements 2.2, 2.3**

- [ ]* 4.4 Write unit tests for ApiLogPanel
  - Test panel visibility toggle
  - Test log rendering
  - Test scroll behavior

- [x] 5. Create LoginScreen component
- [x] 5.1 Implement LoginScreen component
  - Create login form with username/password inputs
  - Add login button with API integration
  - Add register button that navigates to RegisterScreen
  - Add error display
  - Inject gameState and call setPlayer on successful login
  - _Requirements: 4.1, 7.1, 7.2_

- [ ]* 5.2 Write unit tests for LoginScreen
  - Test form rendering
  - Test login flow with mocked API
  - Test error handling
  - Test navigation to register screen

- [x] 6. Create RegisterScreen component
- [x] 6.1 Implement RegisterScreen component
  - Create registration form with username/password/confirm inputs
  - Add register button with API integration
  - Add back to login button
  - Implement auto-login after successful registration
  - Inject gameState and call setPlayer after auto-login
  - _Requirements: 7.2, 7.3, 7.4_

- [ ]* 6.2 Write property tests for RegisterScreen
  - **Property 14: Registration auto-login**
  - **Validates: Requirements 7.3, 7.4**

- [ ]* 6.3 Write unit tests for RegisterScreen
  - Test form rendering
  - Test registration flow with mocked API
  - Test auto-login after registration
  - Test error handling

- [x] 7. Create GameSelectScreen component
- [x] 7.1 Implement GameSelectScreen component
  - Create game list display using apiService.getGames
  - Add game selection handler that calls setGame
  - Add create game button that navigates to GameCreateScreen
  - Display game details
  - Inject gameState and use player.id from state
  - Trigger autoLoadCharacter after game selection
  - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2_

- [ ]* 7.2 Write property tests for GameSelectScreen
  - **Property 10: Character auto-load on game selection**
  - **Validates: Requirements 6.1, 6.2**
  - **Property 11: Battle auto-load on game selection**
  - **Validates: Requirements 10.4**
  - **Property 16: Game creation updates state**
  - **Validates: Requirements 5.4**

- [ ]* 7.3 Write unit tests for GameSelectScreen
  - Test game list rendering
  - Test game selection
  - Test navigation to create game screen

- [x] 8. Create GameCreateScreen component
- [x] 8.1 Implement GameCreateScreen component
  - Create game creation form with name input
  - Add create button with API integration
  - Add cancel button
  - Inject gameState and use player.id from state
  - Call setGame on successful creation
  - Trigger autoLoadCharacter after creation
  - _Requirements: 5.3, 5.4_

- [ ]* 8.2 Write unit tests for GameCreateScreen
  - Test form rendering
  - Test game creation with mocked API
  - Test state update after creation
  - Test cancel behavior

- [x] 9. Create CharacterCreateScreen component
- [x] 9.1 Implement CharacterCreateScreen component
  - Create character creation form (name, race, skills)
  - Add create button with API integration
  - Inject gameState and use game.id from state automatically
  - Call setCharacter on successful creation
  - _Requirements: 4.3, 6.3_

- [ ]* 9.2 Write unit tests for CharacterCreateScreen
  - Test form rendering
  - Test character creation with mocked API
  - Test state update after creation
  - Test auto-population of game.id from state

- [x] 10. Create CharacterScreen component
- [x] 10.1 Implement CharacterScreen component
  - Display character details from state.character
  - Add start battle button that navigates to BattleCreateScreen
  - Display inventory using existing InventoryComponent
  - Inject gameState and use character from state
  - _Requirements: 4.4, 9.2_

- [ ]* 10.2 Write property tests for CharacterScreen
  - **Property 12: Screens use state for API calls**
  - **Validates: Requirements 9.1, 9.2, 9.3**

- [ ]* 10.3 Write unit tests for CharacterScreen
  - Test character details rendering
  - Test start battle button
  - Test inventory integration

- [x] 11. Create BattleCreateScreen component
- [x] 11.1 Implement BattleCreateScreen component
  - Create monster selection interface
  - Add create battle button with API integration
  - Add cancel button
  - Inject gameState and use character.id from state automatically
  - Call setBattle on successful creation
  - Implement battle constraint check (prevent if already in battle)
  - _Requirements: 10.1, 10.2_

- [ ]* 11.2 Write property tests for BattleCreateScreen
  - **Property 21: Single battle per character enforcement**
  - **Validates: Requirements 10.1, 10.2**

- [ ]* 11.3 Write unit tests for BattleCreateScreen
  - Test monster selection rendering
  - Test battle creation with mocked API
  - Test battle constraint enforcement
  - Test error display when constraint violated

- [x] 12. Create BattleScreen component
- [x] 12.1 Implement BattleScreen component
  - Display battle interface using existing BattlesComponent logic
  - Inject gameState and use player, game, character, battle from state
  - Remove manual selection UI (auto-populate from state)
  - Implement battle end handler that calls clearBattle
  - _Requirements: 4.5, 9.1, 10.3_

- [ ]* 12.2 Write unit tests for BattleScreen
  - Test battle interface rendering
  - Test auto-population from state
  - Test battle end clears state

- [x] 13. Update App.vue with new architecture
- [x] 13.1 Integrate state management into App.vue
  - Import and setup useGameState composable
  - Provide gameState to all child components
  - Remove old tab-based navigation
  - _Requirements: 3.1_

- [x] 13.2 Implement screen router in App.vue
  - Use computed currentScreen from gameState
  - Conditionally render screen components based on currentScreen
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 13.3 Add HamburgerMenu and ApiLogPanel to App.vue
  - Add HamburgerMenu component to top-left
  - Add ApiLogPanel component to right side
  - Update layout CSS for new structure
  - Remove old navigation bar
  - _Requirements: 1.1, 2.1_

- [x] 13.4 Implement menu option handlers
  - Handle logout option
  - Handle select game option (clears game, character, battle)
  - Handle select character option (clears character, battle)
  - Handle leave battle option (clears battle)
  - _Requirements: 8.5_

- [ ]* 13.5 Write property tests for App.vue navigation
  - **Property 3: State update reactivity**
  - **Validates: Requirements 9.4**
  - **Property 4: Screen routing correctness**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ]* 13.6 Write integration tests for complete flows
  - Test login → game selection → character creation → battle flow
  - Test state persistence across page reloads
  - Test error handling with API failures
  - Test navigation between screens

- [x] 14. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Add CSS styling and animations
- [x] 15.1 Implement hamburger menu animations
  - Add slide-in transition from left
  - Add fade-in for backdrop
  - Add smooth open/close animations
  - _Requirements: 1.2_

- [x] 15.2 Implement API log panel animations
  - Add slide-in transition from right
  - Add smooth open/close animations
  - _Requirements: 2.2, 2.3_

- [x] 15.3 Update global styles for new layout
  - Remove old navigation bar styles
  - Add responsive design for mobile
  - Ensure consistent spacing and colors
  - Add screen transition animations

- [ ] 16. Final testing and polish
- [ ] 16.1 Manual testing of complete user flows
  - Test all navigation paths
  - Verify animations are smooth
  - Test on different screen sizes
  - Test browser compatibility

- [ ] 16.2 Fix any remaining issues
  - Address bugs found in manual testing
  - Optimize performance if needed
  - Refine error messages

- [ ] 17. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
