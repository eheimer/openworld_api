# Design Document

## Overview

This design implements a global path prefix (`/api`) for all REST API endpoints in the NestJS application. The change is straightforward and centralized, requiring minimal modifications to the application bootstrap code while ensuring all tests and documentation reflect the new URL structure.

The implementation leverages NestJS's built-in `setGlobalPrefix()` method to prepend `/api` to all routes automatically. This approach requires no changes to individual controllers or route decorators, making it a clean and maintainable solution.

## Architecture

### Current State

- All API endpoints are registered at the root path (`/`)
- Example: `POST /auth/login`, `GET /games`, `POST /games/:id/characters`
- Swagger UI is accessible at `/api` (this will need to move)
- OpenAPI spec includes server URL `http://localhost:3000` without base path

### Target State

- All API endpoints will be registered under `/api` prefix
- Example: `POST /api/auth/login`, `GET /api/games`, `POST /api/games/:id/characters`
- Swagger UI will be accessible at `/api-docs` (to avoid conflict with API routes)
- OpenAPI spec will include server URL with `/api` base path
- All test files (e2e, API, integration) will use `/api` prefix
- All REST client HTTP documents will use `/api` prefix

### Configuration Changes

The global prefix is applied in `src/main.ts` during application bootstrap, before any routes are registered. This ensures all controllers automatically inherit the prefix without individual modifications.

## Components and Interfaces

### Modified Components

#### 1. Application Bootstrap (`src/main.ts`)

**Changes:**
- Add `app.setGlobalPrefix('api')` after app creation
- Update Swagger UI path from `'api'` to `'api-docs'`
- Update OpenAPI server configuration to include `/api` base path
- Add startup logging to confirm global prefix configuration

**Rationale:**
- `setGlobalPrefix()` is the idiomatic NestJS approach for path prefixing
- Moving Swagger UI to `/api-docs` prevents conflict with API routes
- Server configuration update ensures generated client SDKs use correct URLs

#### 2. Test Utilities (`test/api/helpers/util.ts`)

**Changes:**
- Update `buildRequest()` method to prepend `/api` to all endpoint paths
- Alternative: Add a constant for the API prefix and use it consistently

**Rationale:**
- Centralizing the prefix logic in the test utility ensures all tests automatically use the correct path
- This approach minimizes changes across individual test files

#### 3. End-to-End Test Files

**Changes:**
- Update all endpoint paths in `*.e2e-spec.ts` files to include `/api` prefix
- Files to update:
  - `test/end2end/battles.e2e-spec.ts`
  - `test/end2end/cascades.e2e-spec.ts`
  - `test/end2end/character-battles.e2e-spec.ts`
  - `test/end2end/character.e2e-spec.ts`
  - `test/end2end/game-delete-player.e2e-spec.ts`
  - `test/end2end/games.e2e-spec.ts`
  - `test/end2end/items.e2e-spec.ts`
  - `test/end2end/lists.e2e-spec.ts`
  - `test/end2end/map.e2e-spec.ts`
  - `test/end2end/players.e2e-spec.ts`

**Rationale:**
- E2E tests should reflect the actual production API structure
- Explicit path updates make the tests self-documenting

#### 4. REST Client HTTP Documents

**Changes:**
- Update `@baseUrl` variable or all endpoint paths to include `/api` prefix
- Files to update:
  - `test/end2end/test-cascades.http`
  - `test/end2end/test-character-battles.http`
  - `test/end2end/test-game-delete-player.http`
  - `test/end2end/test-items.http`

**Rationale:**
- These files are used for manual testing and should match production URLs
- Updating the base URL is cleaner than updating each individual request

## Data Models

No data model changes are required. This is purely a routing/configuration change.

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Prefixed routes are accessible

*For any* valid API endpoint path, when a request is made to `/api/{endpoint}`, the system should route the request successfully and return a non-404 response.

**Validates: Requirements 1.2**

### Property 2: Unprefixed routes return 404

*For any* valid API endpoint path, when a request is made to `/{endpoint}` (without the `/api` prefix), the system should return a 404 Not Found response.

**Validates: Requirements 1.3**

### Property 3: Authentication and authorization preserved

*For any* protected endpoint, when accessed with the `/api` prefix, the system should enforce the same authentication and authorization rules as before the prefix change (requiring valid JWT tokens and checking resource ownership).

**Validates: Requirements 1.5**

## Error Handling

### Routing Errors

**404 Not Found:**
- Returned when accessing endpoints without the `/api` prefix
- Returned when accessing non-existent endpoints under `/api`
- Standard NestJS error response format maintained

**No Breaking Changes:**
- All existing error responses (400, 401, 403, 500, etc.) remain unchanged
- Only the URL path changes; error handling logic is unaffected

### Configuration Errors

**Startup Failures:**
- If global prefix configuration fails, application should fail to start with clear error message
- Swagger setup failures should be logged but not prevent application startup

## Testing Strategy

### Unit Testing

Unit tests for individual services and controllers are unaffected by this change since they test business logic in isolation. No unit test changes are required unless tests explicitly construct URLs.

### Property-Based Testing

This feature will use **fast-check** as the property-based testing library for TypeScript/JavaScript.

**Configuration:**
- Each property test will run a minimum of 100 iterations
- Tests will be tagged with the format: `**Feature: api-path-prefix, Property {number}: {property_text}**`

**Property Test Implementation:**

1. **Property 1: Prefixed routes are accessible**
   - Generate random valid endpoint paths from the OpenAPI spec
   - Make requests to `/api/{endpoint}` with appropriate auth tokens
   - Verify responses are not 404
   - Tag: `**Feature: api-path-prefix, Property 1: Prefixed routes are accessible**`

2. **Property 2: Unprefixed routes return 404**
   - Generate random valid endpoint paths from the OpenAPI spec
   - Make requests to `/{endpoint}` (without prefix)
   - Verify all responses are 404
   - Tag: `**Feature: api-path-prefix, Property 2: Unprefixed routes return 404**`

3. **Property 3: Authentication and authorization preserved**
   - Generate random protected endpoint paths
   - Test with valid tokens, invalid tokens, and no tokens
   - Test with authorized and unauthorized users
   - Verify auth behavior matches expected patterns
   - Tag: `**Feature: api-path-prefix, Property 3: Authentication and authorization preserved**`

### Integration Testing

Integration tests will be updated to use the `/api` prefix in all endpoint paths. The test utility class (`APIUtils`) will be modified to automatically prepend the prefix, ensuring consistency across all tests.

### End-to-End Testing

E2E tests will be updated to reflect the new URL structure:
- All `.e2e-spec.ts` files will have endpoint paths updated to include `/api`
- All `.http` files will have the base URL or individual paths updated to include `/api`
- Tests will verify complete user workflows function correctly with the new paths

### Manual Testing

REST client HTTP documents in `test/end2end/*.http` will be updated to use the new `/api` prefix, allowing developers to manually test endpoints during development.

## Implementation Notes

### Deployment Considerations

**Apache Reverse Proxy:**
- The existing Apache configuration proxies all requests to `http://localhost:3000`
- No Apache configuration changes are required since the prefix is handled by the NestJS application
- The proxy will forward requests to `/api/*` to the application, which will handle routing

**Client Updates:**
- Any existing API clients (web frontend, mobile apps, etc.) will need to update their base URLs
- Consider a phased rollout or temporary support for both paths if needed (not in scope for this spec)

**Database:**
- No database changes required
- No migrations needed

### Backward Compatibility

This change is **not backward compatible** with existing API clients. All clients must update their base URLs to include `/api` prefix. The spec does not include a transition period with dual path support.

### Performance Impact

Negligible performance impact. The global prefix is applied during route registration at startup, not during request processing.

### Security Considerations

No security implications. Authentication and authorization mechanisms remain unchanged.

## Future Enhancements

This change lays the groundwork for:
- Serving static HTML content from the root path (`/`)
- Separating API versioning (e.g., `/api/v1`, `/api/v2`)
- Implementing API gateway patterns
- Adding rate limiting or caching at the `/api` path level
