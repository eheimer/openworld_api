# Implementation Plan

- [x] 1. Configure global API prefix in application bootstrap
  - Add `app.setGlobalPrefix('api')` in `src/main.ts` after app creation
  - Move Swagger UI from `/api` to `/api-docs` to avoid path conflict
  - Update OpenAPI server configuration to include `/api` base path
  - Add startup logging to confirm global prefix configuration
  - _Requirements: 1.1, 1.4, 2.1, 2.3, 3.1_

- [x] 2. Update test utility to support API prefix
  - Modify `test/api/helpers/util.ts` to prepend `/api` to all endpoint paths in `buildRequest()` method
  - Add constant for API prefix to ensure consistency
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 3. Update end-to-end test files
- [x] 3.1 Update battles e2e tests
  - Modify `test/end2end/battles.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.2 Update cascades e2e tests
  - Modify `test/end2end/cascades.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.3 Update character-battles e2e tests
  - Modify `test/end2end/character-battles.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.4 Update character e2e tests
  - Modify `test/end2end/character.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.5 Update game-delete-player e2e tests
  - Modify `test/end2end/game-delete-player.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.6 Update games e2e tests
  - Modify `test/end2end/games.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.7 Update items e2e tests
  - Modify `test/end2end/items.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.8 Update lists e2e tests
  - Modify `test/end2end/lists.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.9 Update map e2e tests
  - Modify `test/end2end/map.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 3.10 Update players e2e tests
  - Modify `test/end2end/players.e2e-spec.ts` to use `/api` prefix in all endpoint paths
  - _Requirements: 4.4_

- [x] 4. Update REST client HTTP documents
- [x] 4.1 Update cascades HTTP document
  - Modify `test/end2end/test-cascades.http` to include `/api` prefix in base URL or all endpoint paths
  - _Requirements: 4.5_

- [x] 4.2 Update character-battles HTTP document
  - Modify `test/end2end/test-character-battles.http` to include `/api` prefix in base URL or all endpoint paths
  - _Requirements: 4.5_

- [x] 4.3 Update game-delete-player HTTP document
  - Modify `test/end2end/test-game-delete-player.http` to include `/api` prefix in base URL or all endpoint paths
  - _Requirements: 4.5_

- [x] 4.4 Update items HTTP document
  - Modify `test/end2end/test-items.http` to include `/api` prefix in base URL or all endpoint paths
  - _Requirements: 4.5_

- [x] 5. Write property-based tests for API prefix behavior
- [x] 5.1 Write property test for prefixed routes accessibility
  - **Property 1: Prefixed routes are accessible**
  - **Validates: Requirements 1.2**
  - Generate random valid endpoint paths from OpenAPI spec
  - Make requests to `/api/{endpoint}` with appropriate auth
  - Verify responses are not 404
  - Use fast-check library with minimum 100 iterations
  - Tag: `**Feature: api-path-prefix, Property 1: Prefixed routes are accessible**`
  - _Requirements: 1.2_

- [x] 5.2 Write property test for unprefixed routes returning 404
  - **Property 2: Unprefixed routes return 404**
  - **Validates: Requirements 1.3**
  - Generate random valid endpoint paths from OpenAPI spec
  - Make requests to `/{endpoint}` without prefix
  - Verify all responses are 404
  - Use fast-check library with minimum 100 iterations
  - Tag: `**Feature: api-path-prefix, Property 2: Unprefixed routes return 404**`
  - _Requirements: 1.3_

- [x] 5.3 Write property test for authentication preservation
  - **Property 3: Authentication and authorization preserved**
  - **Validates: Requirements 1.5**
  - Generate random protected endpoint paths
  - Test with valid tokens, invalid tokens, and no tokens
  - Test with authorized and unauthorized users
  - Verify auth behavior matches expected patterns
  - Use fast-check library with minimum 100 iterations
  - Tag: `**Feature: api-path-prefix, Property 3: Authentication and authorization preserved**`
  - _Requirements: 1.5_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
