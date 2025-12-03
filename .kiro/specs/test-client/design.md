# Design Document

## Overview

The test client is a web-based application that provides QA testers with a user-friendly interface for manually testing the Openworld API. Built with Vue.js and served through NestJS at the `/client/` endpoint, it mirrors the functionality covered in the existing end-to-end test suite. The client enables testers to authenticate, manage games and characters, execute battles, and manipulate inventory items while providing clear visual feedback for all API interactions.

The test client serves as a complement to automated testing, allowing human testers to verify API behavior, explore edge cases, and validate user workflows in a more interactive manner than automated tests alone can provide.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Vue.js Test Client                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Auth      │  │   Games     │  │  Battles    │  │  │
│  │  │ Component   │  │  Component  │  │  Component  │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ Characters  │  │  Inventory  │  │   API       │  │  │
│  │  │ Component   │  │  Component  │  │  Service    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         ServeStaticModule (/client/)                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         API Endpoints (/api/*)                        │  │
│  │  Auth │ Games │ Characters │ Battles │ Inventory     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **HTTP Client**: Axios for API requests
- **Static File Serving**: NestJS ServeStaticModule
- **Styling**: CSS with minimal framework (or Tailwind CSS for rapid development)
- **Build Tool**: Vite for fast development and optimized production builds

### Deployment Model

The test client will be served as static files from the `_static/client` directory within the NestJS application. The ServeStaticModule will be configured to serve these files at the `/client/` route, similar to the existing map editor setup at `/mapeditor`.

## Components and Interfaces

### Vue.js Component Structure

#### 1. App Component (App.vue)
- Root component managing global state
- Handles routing between different test sections
- Manages authentication state and JWT token storage
- Provides navigation menu for accessing different test areas

#### 2. Authentication Component (AuthComponent.vue)
- Login form with username/password inputs
- Registration form for creating test accounts
- Displays current authentication status
- Stores JWT token in component state and localStorage

#### 3. Games Component (GamesComponent.vue)
- Create new game form
- List all games for authenticated player
- View game details (players, characters)
- Update game name
- Delete game
- Add/remove players to/from games

#### 4. Characters Component (CharactersComponent.vue)
- Create character form with race selection, attribute allocation, and skill selection
- View character details
- Delete character
- Display character stats and equipment

#### 5. Battles Component (BattlesComponent.vue)
- Create battle
- Join existing battle
- Add monsters to battle
- Advance battle rounds
- View battle state (participants, enemies, round number)
- Delete battle

#### 6. Inventory Component (InventoryComponent.vue)
- View inventory contents
- Add random items (armor, weapons, jewelry, spellbooks)
- Equip/unequip items
- Drop items
- Display equipped items and character stats

#### 7. API Service (apiService.js)
- Centralized HTTP client configuration
- Request interceptor to add JWT token to headers
- Response interceptor for error handling
- Helper methods for common API operations
- Request/response logging for debugging

#### 8. Request/Response Display Component (ApiLogComponent.vue)
- Displays recent API requests (method, endpoint, payload)
- Displays API responses (status code, headers, body)
- JSON syntax highlighting
- Error highlighting
- Collapsible sections for request/response details

### API Integration

All API calls will use the `/api` prefix as configured in the NestJS application. The API service will:

1. Store the JWT token after successful authentication
2. Include the token in the `Authorization: Bearer <token>` header for all authenticated requests
3. Handle 401 responses by clearing the token and redirecting to login
4. Log all requests and responses for tester visibility

### State Management

Given the relatively simple state requirements, we'll use Vue 3's Composition API with reactive refs and computed properties rather than introducing Vuex or Pinia. State will be managed at the component level with props and emits for parent-child communication.

Key state elements:
- Authentication token (stored in App component and localStorage)
- Current player ID and username
- Selected game ID
- Selected character ID
- API request/response history

## Data Models

### Frontend Data Models

These TypeScript interfaces define the shape of data used in the Vue.js components:

```typescript
interface Player {
  id: number
  username: string
  email?: string
}

interface Game {
  id: number
  name: string
  owner: Player
  players: Player[]
}

interface Character {
  id: number
  name: string
  race: Race
  strength: number
  dexterity: number
  intelligence: number
  skills: CharacterSkill[]
  inventory: Inventory
}

interface Race {
  id: number
  name: string
}

interface CharacterSkill {
  id: number
  level: number
}

interface Battle {
  id: number
  round: number
  initiator: number
  participants: Character[]
  enemies: Enemy[]
}

interface Enemy {
  id: number
  name: string
  actionName: string
  actionValue: number
}

interface Inventory {
  id: number
  armor: ArmorItem[]
  weapons: WeaponItem[]
  jewelry: JewelryItem[]
  spellbooks: SpellbookItem[]
}

interface Item {
  id: number
  name: string
  level: number
}

interface ArmorItem extends Item {
  armorClass: string
  location: string
}

interface WeaponItem extends Item {
  weaponSkill: string
  damage: string
}

interface JewelryItem extends Item {
  location: string
}

interface SpellbookItem extends Item {
  spellSchool: string
}

interface ApiRequest {
  timestamp: Date
  method: string
  endpoint: string
  payload?: any
}

interface ApiResponse {
  timestamp: Date
  status: number
  headers: Record<string, string>
  body: any
}
```

## Co
rrectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

The test client is primarily a UI layer that provides manual testing capabilities for existing API functionality. Most of the acceptance criteria focus on UI behavior (display, formatting, user interaction) which are not suitable for property-based testing. The existing API endpoints that the test client uses are already covered by comprehensive end-to-end tests.

The unique testable aspects of this feature are:
1. The test client static files are served correctly at the `/client/` endpoint
2. The static file serving infrastructure works for all asset types

Since the API functionality is already tested elsewhere, we focus on properties specific to serving the test client itself.

### Correctness Properties

**Property 1: Test client endpoint accessibility**
*For any* HTTP GET request to `/client/` or `/client/index.html`, the system should return HTML content with a 200 status code
**Validates: Requirements 1.1**

**Property 2: Static asset serving**
*For any* static asset file (CSS, JavaScript, images) in the test client directory, requesting that file should return the file content with the appropriate Content-Type header
**Validates: Requirements 1.3**

**Note on API Functionality Testing:**
The test client exercises existing API endpoints (authentication, games, characters, battles, inventory) that are already covered by the comprehensive end-to-end test suite. Requirements 2.1, 3.1-3.3, 4.1-4.3, 5.1-5.3, and 6.1-6.3 describe API behaviors that are validated by existing tests in:
- `test/end2end/players.e2e-spec.ts`
- `test/end2end/games.e2e-spec.ts`
- `test/end2end/character.e2e-spec.ts`
- `test/end2end/battles.e2e-spec.ts`
- `test/end2end/items.e2e-spec.ts`

The test client provides a manual testing interface for these already-tested APIs, so we do not duplicate property-based tests for API functionality that is already comprehensively tested.

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: Display user-friendly messages when API requests fail due to network issues
2. **Authentication Errors**: Clear token and redirect to login on 401 responses
3. **Validation Errors**: Display field-specific validation errors from API responses
4. **Server Errors**: Display error details including status code and error message for 500-level responses

### API Error Responses

The test client will display all error responses from the API, including:
- 400 Bad Request: Validation errors with field-specific messages
- 401 Unauthorized: Authentication required or token expired
- 403 Forbidden: Insufficient permissions for the requested operation
- 404 Not Found: Resource does not exist
- 500 Internal Server Error: Server-side errors with error details

### Error Display Component

All errors will be displayed in a consistent format showing:
- HTTP status code
- Error message from API
- Request details (method, endpoint, payload)
- Timestamp of the error

## Testing Strategy

### Unit Testing

Unit tests will focus on:

1. **API Service Tests**
   - Token injection into request headers
   - Error response handling
   - Request/response logging functionality
   - Base URL configuration

2. **Component Logic Tests**
   - Form validation logic
   - Data transformation functions
   - State management logic

### Property-Based Testing

Property-based tests will verify:

1. **Static File Serving**
   - Property 1: Test client endpoint returns HTML (example test)
   - Property 2: All static assets are served with correct content types

**Testing Framework**: We will use `fast-check` for property-based testing in JavaScript/TypeScript, integrated with Jest.

**Test Configuration**: Each property-based test will run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging**: Each property-based test will include a comment explicitly referencing the correctness property from this design document using the format: `**Feature: test-client, Property {number}: {property_text}**`

### Integration Testing

Integration tests will verify:

1. **End-to-End Workflows**
   - Complete authentication flow (register → login → authenticated request)
   - Complete game workflow (create game → add player → create character)
   - Complete battle workflow (create battle → add monster → advance round)
   - Complete inventory workflow (add item → equip → unequip → drop)

2. **Static File Serving Integration**
   - Verify ServeStaticModule configuration serves files from correct directory
   - Verify routing does not conflict with API routes
   - Verify MIME types are set correctly for different file types

### Manual Testing

The test client itself is a tool for manual testing. QA testers will use it to:

1. Verify API responses match expected formats
2. Test edge cases and boundary conditions
3. Validate error messages are clear and helpful
4. Ensure UI provides adequate feedback for all operations
5. Test workflows that combine multiple API calls

## Implementation Notes

### Directory Structure

```
openworld_api/
├── _static/
│   └── client/
│       ├── index.html
│       ├── css/
│       │   └── styles.css
│       ├── js/
│       │   ├── app.js (compiled Vue.js application)
│       │   └── vendor.js (Vue.js and dependencies)
│       └── assets/
│           └── (images, fonts, etc.)
├── client-src/
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── components/
│   │   │   ├── AuthComponent.vue
│   │   │   ├── GamesComponent.vue
│   │   │   ├── CharactersComponent.vue
│   │   │   ├── BattlesComponent.vue
│   │   │   ├── InventoryComponent.vue
│   │   │   └── ApiLogComponent.vue
│   │   └── services/
│   │       └── apiService.js
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
```

### Build Process

1. Vue.js application source code lives in `client-src/`
2. Vite builds the application and outputs to `_static/client/`
3. NestJS serves the built files from `_static/client/` at `/client/` endpoint
4. Development workflow:
   - Run Vite dev server for client development: `npm run dev` (in client-src/)
   - Run NestJS server for API: `npm run start:dev` (in root)
   - For production: Build client first, then start NestJS

### NestJS Configuration

Update `app.module.ts` to add ServeStaticModule configuration:

```typescript
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', '_static', 'client'),
  serveRoot: '/client',
  exclude: ['/api*'] // Ensure API routes take precedence
})
```

### Vue.js Application Structure

The Vue.js application will use:
- **Composition API** for component logic
- **Reactive refs** for state management
- **Axios** for HTTP requests with interceptors
- **Component-based architecture** with clear separation of concerns

### API Service Implementation

The API service will:
- Configure Axios with base URL (`/api`)
- Add request interceptor to inject JWT token
- Add response interceptor to handle 401 errors
- Provide helper methods for common operations
- Log all requests and responses for debugging

### Styling Approach

The test client will use a minimal, functional design:
- Clean, readable typography
- Clear visual hierarchy
- Adequate spacing and padding
- Color coding for success/error states
- Responsive layout for different screen sizes
- Syntax highlighting for JSON responses

### Steering Documentation Updates

A new steering file will be created at `.kiro/steering/test-client-maintenance.md` with the following content:

```markdown
# Test Client Maintenance

## Overview

The test client at `/client/` provides manual QA testing capabilities for the Openworld API. It must be kept in sync with API changes to remain useful.

## Requirements for API Changes

When implementing new API functionality or modifying existing endpoints:

1. **Update Test Client UI**: Add or modify components in the test client to expose the new/changed functionality
2. **Update API Service**: Add helper methods for new endpoints
3. **Test the Integration**: Manually verify the test client can successfully call the new/changed endpoints
4. **Update Documentation**: Document any new test workflows in the test client

## Adding New Test Interfaces

To add a new test interface to the client:

1. Create a new Vue component in `client-src/src/components/`
2. Add navigation link in `App.vue`
3. Implement form inputs for request parameters
4. Use the API service to make requests
5. Display request/response details using `ApiLogComponent`
6. Build and test the updated client

## Synchronization Checklist

- [ ] New API endpoint has corresponding UI in test client
- [ ] API service includes helper method for new endpoint
- [ ] Test client can successfully call the endpoint
- [ ] Request/response display works correctly
- [ ] Error handling is implemented
- [ ] Documentation is updated

## Build and Deployment

After making changes to the test client:

```bash
cd client-src
npm run build
cd ..
# Test with NestJS
npm run start:dev
# Navigate to http://localhost:3000/client/
```
```

This steering file will ensure future developers maintain the test client alongside API changes.
