# Implementation Plan

- [ ] 1. Create TypeScript configuration for Jest
  - Create `tsconfig.jest.json` at project root that extends base tsconfig
  - Configure compiler options: `module: "commonjs"`, `moduleResolution: "node"`, `isolatedModules: true`
  - Set `allowImportingTsExtensions: false` and `noEmit: false`
  - Include src and test directories, exclude node_modules and dist
  - _Requirements: 2.1, 2.2, 2.3, 4.1_

- [ ] 2. Update main Jest configuration in package.json
  - Add `moduleNameMapper` to strip `.js` extensions from imports (pattern: `"^(\\.{1,2}/.*)\\.js$": "$1"`)
  - Configure `transform` section to use ts-jest with custom tsconfig and `useESM: false`
  - Add inline comments explaining ES module-specific settings
  - Maintain existing settings: `moduleFileExtensions`, `rootDir`, `testRegex`, `collectCoverageFrom`, `coverageDirectory`
  - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.4, 4.2, 4.3_

- [ ] 3. Update E2E test configuration
  - Modify `test/end2end/jest-e2e.json` to include `moduleNameMapper` for `.js` extension handling
  - Update `transform` section to use ts-jest with path to `tsconfig.jest.json` (relative path: `../../tsconfig.jest.json`)
  - Configure ts-jest options: `useESM: false`
  - Ensure consistency with main Jest configuration
  - _Requirements: 1.3, 2.1, 4.3_

- [ ] 4. Verify unit test execution
  - Run `npm run test` to execute all unit tests
  - Confirm all `.js` imports resolve correctly to `.ts` source files
  - Verify no TS151002 warnings appear in output
  - Check that existing tests pass or fail for legitimate reasons (not import errors)
  - _Requirements: 1.1, 2.2, 3.1, 3.5_

- [ ] 5. Verify E2E test execution
  - Run `npm run test:e2e:reseed` to reseed database and execute E2E tests
  - Confirm imports from src/ resolve correctly in test files
  - Verify test execution completes without module resolution errors
  - _Requirements: 1.1, 3.2, 3.5_

- [ ] 6. Verify API and integration test execution
  - Run `npm run test:api` to execute API tests
  - Run `npm run test:integration` to execute integration tests
  - Confirm helper imports and cross-directory imports resolve correctly
  - Verify all test types work with the new configuration
  - _Requirements: 1.3, 3.3, 3.4, 3.5_

- [ ]\* 7. Verify watch mode and coverage
  - Run `npm run test:watch` to verify watch mode works correctly
  - Run `npm run test:cov` to verify coverage reports generate
  - Confirm source maps work for debugging (check stack traces)
  - Test that file changes trigger appropriate test re-runs
  - _Requirements: 2.4, 3.1_
