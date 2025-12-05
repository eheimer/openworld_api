# Design Document

## Overview

This design transforms the Openworld API test client from a tab-based testing interface into a state-driven game simulator. The redesign introduces centralized state management, automatic screen navigation based on state, a hamburger menu for navigation, and a slide-out API log panel. The system will provide a more immersive game experience while maintaining the ability to test API functionality.

## Architecture

### State Management Architecture

The application will use Vue 3's Composition API with a centralized state management pattern using `reactive` and `provide/inject`. This approach provides:

- Single source of truth for application state
- Automatic reactivity across all components
- Persistence to localStorage
- Easy state restoration on page load

### Component Hierarchy

```
App.vue (State Provider)
├── HamburgerMenu.vue (Context-sensitive navigation)
├── ApiLogPanel.vue (Slide-out from right)
└── Screen Router (Conditional rendering based on state)
    ├── LoginScreen.vue
    ├── RegisterScreen.vue
    ├── GameSelectScreen.vue
    ├── GameCreateScreen.vue
    ├── CharacterCreateScreen.vue
    ├── CharacterScreen.vue
    ├── BattleCreateScreen.vue
    └── BattleScreen.vue
```

### State Flow

```
User Action → State Update → localStorage Sync → Screen Re-evaluation → Component Re-render
```

## Components and Interfaces

### State Object

```typescript
interface GameState {
  player: {
    id: number
    username: string
    token: string
  } | null
  
  game: {
    id: number
    name: string
    ownerId: number
  } | null
  
  character: {
    id: number
    name: string
    gameId: number
  } | null
  
  battle: {
    id: number
    characterId: number
  } | null
}
```

### State Management Service

A composable `useGameState()` that provides:

```typescript
interface GameStateComposable {
  // State
  state: Reactive<GameState>
  
  // Computed
  currentScreen: ComputedRef<string>
  menuOptions: ComputedRef<MenuOption[]>
  
  // Actions
  setPlayer(player: Player): void
  setGame(game: Game): void
  setCharacter(character: Character): void
  setBattle(battle: Battle): void
  clearState(): void
  logout(): void
  
  // Auto-load functions
  autoLoadCharacter(gameId: number): Promise<void>
  autoLoadBattle(characterId: number): Promise<void>
}
```

### Screen Router Logic

The screen router will use computed properties to determine which screen to display:

```typescript
const currentScreen = computed(() => {
  if (!state.player) return 'login'
  if (!state.game) return 'game-select'
  if (!state.character) return 'character-create'
  if (!state.battle) return 'character'
  return 'battle'
})
```

### HamburgerMenu Component

Props:
- `menuOptions: MenuOption[]` - Context-sensitive menu items

Emits:
- `option-selected: (optionId: string) => void`

Features:
- Slide-in animation from left
- Click-outside-to-close behavior
- Icon-based menu items
- Conditional rendering based on state

Menu Options by State:
```typescript
// player === null
['login']

// player !== null, game === null
['logout', 'select-game']

// player !== null, game !== null, character === null
['logout', 'select-game']

// player !== null, game !== null, character !== null, battle === null
['logout', 'select-game', 'select-character']

// All populated
['logout', 'select-game', 'select-character', 'leave-battle']
```

### ApiLogPanel Component

Props:
- `isOpen: boolean` - Controls visibility

Emits:
- `close: () => void`

Features:
- Slide-in animation from right
- Fixed width (400px)
- Scrollable log content
- Toggle button visible when closed
- Reuses existing ApiLogComponent

### Screen Components

All screen components will:
- Inject the game state using `inject('gameState')`
- Auto-populate forms using state values
- Update state upon successful operations
- Handle errors gracefully

#### LoginScreen

Features:
- Username/password form
- Login button
- Register button (navigates to RegisterScreen)
- Error display

State Updates:
- Sets `state.player` on successful login

#### RegisterScreen

Features:
- Username/password/confirm password form
- Register button
- Back to login button
- Auto-login after registration

State Updates:
- Sets `state.player` after auto-login

#### GameSelectScreen

Features:
- List of games for the player
- Game selection
- Create game button
- Game details display

State Updates:
- Sets `state.game` on selection
- Triggers `autoLoadCharacter()` after game selection

#### GameCreateScreen

Features:
- Game name input
- Create button
- Cancel button

State Updates:
- Sets `state.game` on successful creation
- Triggers `autoLoadCharacter()` after creation

#### CharacterCreateScreen

Features:
- Character creation form (name, race, skills)
- Uses `state.game.id` automatically
- Create button

State Updates:
- Sets `state.character` on successful creation

#### CharacterScreen

Features:
- Character details display
- Uses `state.character` automatically
- Start battle button
- Inventory display

State Updates:
- None (read-only display)

#### BattleCreateScreen

Features:
- Monster selection
- Uses `state.character.id` automatically
- Create battle button
- Cancel button

State Updates:
- Sets `state.battle` on successful creation

#### BattleScreen

Features:
- Battle interface
- Uses `state.player`, `state.game`, `state.character`, `state.battle` automatically
- Combat actions
- Battle status display

State Updates:
- Clears `state.battle` when battle ends

## Data Models

### LocalStorage Schema

```typescript
{
  "gameState": {
    "player": { ... } | null,
    "game": { ... } | null,
    "character": { ... } | null,
    "battle": { ... } | null
  }
}
```

### API Integration

The existing `apiService.js` will be extended with helper methods:

```typescript
// Authentication
apiService.login(username, password): Promise<LoginResponse>
apiService.register(username, password): Promise<void>

// Games
apiService.getGames(playerId): Promise<Game[]>
apiService.createGame(name, ownerId): Promise<Game>

// Characters
apiService.getCharactersByGame(gameId, playerId): Promise<Character[]>
apiService.createCharacter(data): Promise<Character>

// Battles
apiService.getActiveBattle(characterId): Promise<Battle | null>
apiService.createBattle(characterId, monsterId): Promise<Battle>
apiService.endBattle(battleId): Promise<void>
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable properties from the prework, several can be consolidated:

- Properties 4.1-4.5 (screen routing for specific states) are all examples of the same routing logic and can be tested together
- Properties 8.1-8.4 (menu options for specific states) are all examples of the same menu logic and can be tested together
- Properties 3.2-3.5 (state updates for different entities) follow the same pattern and can be combined
- Properties 6.3-6.4 are edge cases of the auto-load behavior in 6.2

The consolidated properties below eliminate redundancy while maintaining comprehensive coverage.

### State Management Properties

Property 1: State persistence on change
*For any* state property update (player, game, character, or battle), the system should immediately persist the entire state object to localStorage
**Validates: Requirements 3.6**

Property 2: State restoration on load
*For any* valid state stored in localStorage, when the application loads, the system should restore that state exactly
**Validates: Requirements 3.7**

Property 3: State update reactivity
*For any* state property change, all displayed screens and components should immediately reflect the new state values
**Validates: Requirements 9.4**

### Navigation Properties

Property 4: Screen routing correctness
*For any* combination of state values (player, game, character, battle), the system should display exactly one screen according to the routing rules: null player → login, null game → game-select, null character → character-create, null battle → character, all populated → battle
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

Property 5: Menu option context sensitivity
*For any* combination of state values, the hamburger menu should display exactly the options appropriate for that state (e.g., only login when all null, logout + select game when player exists, etc.)
**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

Property 6: Menu interaction closes menu
*For any* menu option selection, the hamburger menu should close after executing the action
**Validates: Requirements 1.4**

Property 7: Click outside closes menu
*For any* click event outside the hamburger menu boundaries when the menu is open, the menu should close
**Validates: Requirements 1.3**

### UI Interaction Properties

Property 8: API log toggle behavior
*For any* state of the API log panel (open or closed), clicking the toggle button should change the panel to the opposite state
**Validates: Requirements 2.2, 2.3**

Property 9: Hamburger menu toggle behavior
*For any* state of the hamburger menu (open or closed), clicking the menu icon should change the menu to the opposite state
**Validates: Requirements 1.2**

### Auto-population Properties

Property 10: Character auto-load on game selection
*For any* game selection where the player has a character in that game, the system should automatically query the API and populate the character property in state
**Validates: Requirements 6.1, 6.2**

Property 11: Battle auto-load on game selection
*For any* game selection where the player's character has an active battle, the system should automatically populate the battle property in state
**Validates: Requirements 10.4**

Property 12: Screens use state for API calls
*For any* API request made from any screen, the system should use state properties (player, game, character, battle) to populate request parameters without requiring user input
**Validates: Requirements 9.1, 9.2, 9.3**

### Authentication Flow Properties

Property 13: Login updates state
*For any* successful login, the system should populate the player property with the authenticated user's information
**Validates: Requirements 3.2**

Property 14: Registration auto-login
*For any* successful registration, the system should automatically log in the user and populate the player property in state
**Validates: Requirements 7.3, 7.4**

Property 15: Logout clears state
*For any* logout action, the system should clear all state properties (player, game, character, battle) and navigate to the login screen
**Validates: Requirements 8.5**

### Game Flow Properties

Property 16: Game creation updates state
*For any* successful game creation, the system should populate the game property in state and trigger character auto-load
**Validates: Requirements 5.4**

Property 17: Game selection updates state
*For any* game selection, the system should populate the game property in state
**Validates: Requirements 3.3**

Property 18: Character creation updates state
*For any* successful character creation, the system should populate the character property in state
**Validates: Requirements 3.4**

Property 19: Battle creation updates state
*For any* successful battle creation, the system should populate the battle property in state
**Validates: Requirements 3.5**

Property 20: Battle end clears state
*For any* battle that ends, the system should clear the battle property from state
**Validates: Requirements 10.3**

### Battle Constraint Properties

Property 21: Single battle per character enforcement
*For any* character that is already in a battle, attempting to create another battle should be prevented and display an error message
**Validates: Requirements 10.1, 10.2**

## Error Handling

### Authentication Errors

- Invalid credentials: Display error message on login screen
- Registration validation: Display field-specific errors
- Token expiration: Clear state and redirect to login (handled by apiService)

### API Errors

- Network errors: Display user-friendly error messages
- 404 errors: Handle missing resources gracefully
- 500 errors: Display generic error message and log details

### State Errors

- Corrupted localStorage: Clear and reinitialize state
- Missing required state: Redirect to appropriate screen
- Invalid state transitions: Prevent and log warning

### UI Errors

- Failed auto-load: Display error and allow manual retry
- Battle constraint violation: Prevent action and show error message

## Testing Strategy

### Unit Testing

Unit tests will cover:

- State management functions (setPlayer, setGame, etc.)
- Screen routing logic computation
- Menu option computation based on state
- localStorage serialization/deserialization
- Individual component rendering with mocked state

Test files:
- `useGameState.test.js` - State management composable
- `HamburgerMenu.test.vue` - Menu component
- `ApiLogPanel.test.vue` - Log panel component
- Screen component tests for each screen

### Property-Based Testing

Property-based tests will use **fast-check** (JavaScript property testing library) to verify universal properties across many randomly generated inputs.

Each property test will:
- Run a minimum of 100 iterations
- Generate random state combinations
- Verify the property holds for all inputs
- Be tagged with the property number from this design document

Property test files:
- `state-management.property.test.js` - Properties 1-3, 13-20
- `navigation.property.test.js` - Properties 4-7
- `ui-interaction.property.test.js` - Properties 8-9
- `auto-population.property.test.js` - Properties 10-12
- `battle-constraints.property.test.js` - Property 21

### Integration Testing

Integration tests will verify:
- Complete user flows (login → game selection → character creation → battle)
- API integration with real backend
- localStorage persistence across page reloads
- Error handling with API failures

### Manual Testing

Manual testing checklist:
- Visual verification of hamburger menu animation
- Visual verification of API log panel slide-out
- Responsive design on different screen sizes
- Browser compatibility (Chrome, Firefox, Safari)

## Implementation Notes

### Vue 3 Composition API

The implementation will use Vue 3's Composition API for:
- Better TypeScript support
- Easier state management
- More testable code
- Better code organization

### CSS Transitions

Animations will use CSS transitions for:
- Hamburger menu slide-in (transform: translateX)
- API log panel slide-in (transform: translateX)
- Smooth state transitions

### LocalStorage Strategy

State will be persisted as a single JSON object:
- Debounced writes to avoid excessive I/O
- Validation on read to handle corrupted data
- Fallback to empty state if invalid

### Backward Compatibility

The existing apiService will be preserved and extended:
- Existing logging functionality maintained
- New helper methods added
- No breaking changes to existing API

### Performance Considerations

- Lazy loading of screen components
- Debounced localStorage writes
- Efficient state change detection
- Minimal re-renders using Vue's reactivity

## Migration Strategy

### Phase 1: State Management

1. Create `useGameState` composable
2. Integrate with App.vue
3. Add localStorage persistence
4. Test state management in isolation

### Phase 2: UI Components

1. Create HamburgerMenu component
2. Create ApiLogPanel component
3. Update App.vue layout
4. Test UI interactions

### Phase 3: Screen Components

1. Create screen components one by one
2. Integrate with state management
3. Test each screen in isolation
4. Test navigation between screens

### Phase 4: Integration

1. Wire all components together
2. Test complete user flows
3. Fix integration issues
4. Performance optimization

### Phase 5: Polish

1. Add animations and transitions
2. Responsive design improvements
3. Error handling refinement
4. Documentation updates
