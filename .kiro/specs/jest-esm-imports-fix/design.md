# Design Document

## Overview

This design addresses the Jest test failures caused by ES module imports using `.js` extensions in TypeScript source files. The solution involves configuring ts-jest to properly resolve `.js` extensions to their corresponding `.ts` source files, while maintaining compatibility with the project's `nodenext` module resolution strategy.

The fix requires:

1. Creating a dedicated TypeScript configuration for Jest
2. Updating Jest configuration in package.json with ts-jest options
3. Updating the e2e test configuration file
4. Ensuring all test types use consistent configuration

## Architecture

### Configuration Flow

```
package.json (jest config)
    ↓
tsconfig.jest.json (extends tsconfig.json)
    ↓
ts-jest transformer
    ↓
Module resolution (.js → .ts)
    ↓
Test execution
```

### Key Components

1. **tsconfig.jest.json** - TypeScript configuration optimized for Jest
2. **package.json jest section** - Main Jest configuration with ts-jest options
3. **test/end2end/jest-e2e.json** - E2E test configuration
4. **ts-jest transformer** - Handles TypeScript compilation and module resolution

## Components and Interfaces

### 1. TypeScript Configuration for Jest (tsconfig.jest.json)

**Purpose:** Provide Jest-specific TypeScript compiler options that support ES modules and proper module resolution.

**Configuration:**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs", // Jest works best with CommonJS
    "moduleResolution": "node", // Standard Node resolution for tests
    "isolatedModules": true, // Required for nodenext compatibility
    "allowImportingTsExtensions": false, // Disable since we're using .js
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "noEmit": false, // Allow emit for ts-jest
    "sourceMap": true // Enable debugging
  },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Rationale:**

- `module: "commonjs"` - Jest's module system works more reliably with CommonJS
- `moduleResolution: "node"` - Standard resolution that ts-jest can work with
- `isolatedModules: true` - Eliminates TS151002 warnings about hybrid module kinds
- Extends base config to inherit other settings like decorators and lib

### 2. Jest Configuration in package.json

**Purpose:** Configure Jest to use ts-jest with proper module resolution for `.js` extensions.

**Configuration:**

```json
{
  "jest": {
    "preset": "ts-jest/presets/default-esm",
    "testEnvironment": "node",
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": [
        "ts-jest",
        {
          "tsconfig": "tsconfig.jest.json",
          "useESM": false
        }
      ]
    },
    "moduleNameMapper": {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage"
  }
}
```

**Key Settings:**

- `moduleNameMapper` - Strips `.js` extensions from imports, allowing resolution to `.ts` files
- `transform` with ts-jest options - Uses custom tsconfig and disables ESM mode
- `useESM: false` - Keeps Jest in CommonJS mode for better compatibility

### 3. E2E Test Configuration (test/end2end/jest-e2e.json)

**Purpose:** Provide consistent configuration for end-to-end tests.

**Configuration:**

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        "tsconfig": "../../tsconfig.jest.json",
        "useESM": false
      }
    ]
  },
  "moduleNameMapper": {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
}
```

**Rationale:**

- Mirrors main Jest config for consistency
- Adjusts tsconfig path relative to test/end2end directory
- Uses same module resolution strategy

## Data Models

No new data models are required. This is a configuration-only change.

## Error Handling

### Current Errors

1. **Module Resolution Error:**

   ```
   Cannot find module './weapons.service.js' from 'items/weapons/weapons.service.spec.ts'
   ```

   **Solution:** `moduleNameMapper` strips `.js` extension, allowing Jest to find `.ts` file

2. **TS151002 Warning:**
   ```
   Using hybrid module kind (Node16/18/Next) is only supported in "isolatedModules: true"
   ```
   **Solution:** Set `isolatedModules: true` in tsconfig.jest.json

### Potential Issues

1. **Path Mapping Conflicts:**
   - If tests use path aliases (e.g., `@app/...`), ensure `moduleNameMapper` doesn't interfere
   - Current codebase uses relative imports, so this shouldn't be an issue

2. **Mixed Module Systems:**
   - Some dependencies might expect ESM
   - Solution: Keep `esModuleInterop: true` and `allowSyntheticDefaultImports: true`

3. **Source Map Issues:**
   - Debugging might be affected if source maps aren't generated
   - Solution: Ensure `sourceMap: true` in tsconfig.jest.json

## Testing Strategy

### Verification Steps

1. **Unit Tests:**

   ```bash
   npm run test
   ```

   - Should execute all `*.spec.ts` files in src/
   - Should resolve all `.js` imports correctly
   - Should show no TS151002 warnings

2. **E2E Tests:**

   ```bash
   npm run test:e2e
   ```

   - Should execute all `*.e2e-spec.ts` files
   - Should resolve imports from src/ correctly

3. **API Tests:**

   ```bash
   npm run test:api
   ```

   - Should execute tests in test/api/
   - Should resolve helper imports correctly

4. **Integration Tests:**

   ```bash
   npm run test:integration
   ```

   - Should execute tests in test/integration/

5. **Watch Mode:**
   ```bash
   npm run test:watch
   ```

   - Should work with file watching
   - Should re-run tests on changes

### Success Criteria

- All test commands execute without module resolution errors
- No TS151002 warnings appear
- All existing tests pass (or fail for legitimate reasons, not import issues)
- Test coverage reports generate correctly
- Debug mode works with proper source maps

## Alternative Approaches Considered

### Alternative 1: Use extensionsToTreatAsEsm

**Approach:** Configure Jest to treat `.ts` files as ESM

```json
{
  "extensionsToTreatAsEsm": [".ts"],
  "preset": "ts-jest/presets/default-esm"
}
```

**Pros:**

- More aligned with true ESM behavior
- Future-proof for native ESM support

**Cons:**

- More complex configuration
- Requires experimental Node.js flags
- Less stable with current Jest/ts-jest versions
- May require changes to test files (e.g., top-level await handling)

**Decision:** Rejected due to complexity and stability concerns

### Alternative 2: Change Imports Back to .ts Extensions

**Approach:** Revert all imports to use `.ts` extensions

**Pros:**

- Simpler Jest configuration
- No module resolution mapping needed

**Cons:**

- Breaks runtime execution (Node.js requires `.js` for ESM)
- Breaks build process
- Goes against ES module standards
- Would require reverting the entire refactor

**Decision:** Rejected as it defeats the purpose of the ES module migration

### Alternative 3: Use Babel Instead of ts-jest

**Approach:** Replace ts-jest with Babel for test transformation

**Pros:**

- Babel has mature ESM support
- More flexible transformation pipeline

**Cons:**

- Requires additional dependencies
- Different type-checking behavior
- More configuration complexity
- Team is already familiar with ts-jest

**Decision:** Rejected to minimize changes and maintain consistency

## Implementation Notes

### Order of Operations

1. Create `tsconfig.jest.json` first
2. Update `package.json` jest configuration
3. Update `test/end2end/jest-e2e.json`
4. Test each test type individually
5. Verify watch mode and coverage

### Configuration Validation

After implementation, verify:

- `ts-jest` can find and use `tsconfig.jest.json`
- Module resolution works for relative imports
- No warnings appear during test execution
- All test types use consistent configuration

### Rollback Plan

If issues arise:

1. Keep `tsconfig.jest.json` for future use
2. Temporarily add `ts-jest` config to ignore specific errors
3. Document any tests that need special handling
4. Consider Alternative 1 (ESM preset) as fallback
