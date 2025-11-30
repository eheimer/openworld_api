# Requirements Document

## Introduction

The Openworld API project has been refactored to use ES modules with TypeScript, requiring all imports to use `.js` extensions (e.g., `import { Service } from './service.js'`). While this works correctly for the NestJS application runtime and build process, Jest tests are failing because the test runner cannot resolve these `.js` extensions when the actual source files are `.ts`. The Jest configuration needs to be updated to properly handle ES module imports with `.js` extensions in a TypeScript codebase.

## Glossary

- **Jest** - The JavaScript testing framework used for unit, integration, and e2e tests
- **ts-jest** - TypeScript preprocessor for Jest that enables testing TypeScript code
- **ES Modules** - ECMAScript module system using `import`/`export` syntax
- **Module Resolution** - The process by which the test runner locates and loads imported modules
- **Test Runner** - The Jest process that executes test files

## Requirements

### Requirement 1

**User Story:** As a developer, I want Jest to resolve `.js` import extensions to their corresponding `.ts` source files, so that tests can run successfully without modifying import statements.

#### Acceptance Criteria

1. WHEN THE Test Runner executes a test file containing imports with `.js` extensions, THE Test Runner SHALL resolve those imports to the corresponding `.ts` source files.
2. THE Test Runner SHALL support the `nodenext` module resolution strategy configured in tsconfig.json.
3. THE Test Runner SHALL apply the module resolution fix to all test types (unit, integration, e2e, and api tests).
4. THE Test Runner SHALL maintain compatibility with the existing ES module configuration (`"type": "module"` in package.json).

### Requirement 2

**User Story:** As a developer, I want Jest to properly handle TypeScript's `nodenext` module resolution, so that the test configuration aligns with the application's TypeScript configuration.

#### Acceptance Criteria

1. THE Test Runner SHALL configure ts-jest with `isolatedModules: true` to support the `nodenext` module kind.
2. THE Test Runner SHALL suppress or eliminate the TS151002 warning about hybrid module kinds.
3. THE Test Runner SHALL use a tsconfig specifically for Jest that extends the base configuration with test-appropriate overrides.
4. THE Test Runner SHALL maintain source map support for debugging test failures.

### Requirement 3

**User Story:** As a developer, I want all existing test suites to pass without modification, so that the fix is transparent and doesn't require updating hundreds of import statements.

#### Acceptance Criteria

1. WHEN THE Test Runner executes unit tests via `npm run test`, THE Test Runner SHALL successfully resolve all imports and execute tests.
2. WHEN THE Test Runner executes e2e tests via `npm run test:e2e`, THE Test Runner SHALL successfully resolve all imports and execute tests.
3. WHEN THE Test Runner executes api tests via `npm run test:api`, THE Test Runner SHALL successfully resolve all imports and execute tests.
4. WHEN THE Test Runner executes integration tests via `npm run test:integration`, THE Test Runner SHALL successfully resolve all imports and execute tests.
5. THE Test Runner SHALL not require changes to existing test files or import statements.

### Requirement 4

**User Story:** As a developer, I want the Jest configuration to be maintainable and well-documented, so that future developers understand the ES module setup.

#### Acceptance Criteria

1. THE Jest Configuration SHALL use a dedicated `tsconfig.jest.json` file that extends the base TypeScript configuration.
2. THE Jest Configuration SHALL include inline comments explaining the ES module-specific settings.
3. THE Jest Configuration SHALL be consistent across all test types (unit, e2e, api, integration).
4. THE Jest Configuration SHALL document the `extensionsToTreatAsEsm` and `moduleNameMapper` settings where applicable.
