# Design Document

## Overview

This design outlines the migration from Jest to Vitest for the Openworld API test suite. The migration will replace Jest's CommonJS-based test runner with Vitest's native ESM support, resolving compatibility issues with TypeORM's dynamic imports while maintaining test functionality and improving developer experience.

## Architecture

### Current Architecture (Jest)

```
Test Execution Flow:
1. Jest CLI invoked
2. ts-jest transforms TypeScript → JavaScript (CommonJS)
3. moduleNameMapper strips .js extensions
4. Tests run in CommonJS environment
5. TypeORM attempts dynamic import → FAILS
```

**Problems:**

- CommonJS transformation breaks dynamic ESM imports
- Complex configuration (jest.config.js, tsconfig.jest.json, moduleNameMapper)
- Slow transformation via ts-jest
- Poor ESM support

### Target Architecture (Vitest)

```
Test Execution Flow:
1. Vitest CLI invoked
2. Vite transforms TypeScript → JavaScript (ESM, cached)
3. Tests run in native ESM environment
4. TypeORM dynamic imports work natively
5. Hot module reload for watch mode
```

**Benefits:**

- Native ESM support
- Simple configuration
- Fast transformation with caching
- Better developer experience

### ESM Transformation Details

**How Vitest Handles TypeScript:**

Vitest uses Vite's built-in transformer which:

1. Reads `.ts` files on-demand
2. Transforms TypeScript → JavaScript **as ESM** (not CommonJS)
3. Caches transformed output in memory
4. Executes in Node's native ESM environment

**Key Differences from Jest:**

- **Jest**: TypeScript → CommonJS → Requires moduleNameMapper hacks
- **Vitest**: TypeScript → ESM → Works natively with your `"type": "module"` package.json

**What This Enables:**

- ✅ Native `import` and `export` statements
- ✅ Dynamic `import()` expressions (solves TypeORM SQLite issue)
- ✅ `import.meta` usage
- ✅ Top-level `await`
- ✅ `.js` extensions in imports resolve correctly to `.ts` files

**No Configuration Needed:**
Since your package.json already has `"type": "module"`, Vitest automatically runs in ESM mode. No additional setup required!

## Components and Interfaces

### 1. Vitest Configuration Files

#### vitest.config.ts (Base Configuration)

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'test/', 'dist/', '**/*.spec.ts', '**/*.test.ts', 'migration/']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

#### vitest.config.unit.ts

```typescript
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['test/unit/**/*.spec.ts'],
      name: 'unit'
    }
  })
)
```

#### vitest.config.integration.ts

```typescript
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['test/integration/**/*.spec.ts'],
      name: 'integration',
      setupFiles: ['./test/setup-integration.ts']
    }
  })
)
```

#### vitest.config.api.ts

```typescript
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['test/api/**/*.spec.ts'],
      name: 'api',
      setupFiles: ['./test/setup-api.ts'],
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      }
    }
  })
)
```

#### vitest.config.e2e.ts

```typescript
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['test/end2end/**/*.e2e-spec.ts'],
      name: 'e2e',
      setupFiles: ['./test/setup-e2e.ts'],
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true
        }
      },
      testTimeout: 30000,
      hookTimeout: 30000
    }
  })
)
```

### 2. Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:cov": "vitest run --coverage",
    "test:unit": "vitest run --config vitest.config.unit.ts",
    "test:unit:watch": "vitest --config vitest.config.unit.ts",
    "test:integration": "vitest run --config vitest.config.integration.ts",
    "test:integration:watch": "vitest --config vitest.config.integration.ts",
    "test:integration:reseed": "npm run reseed:test && vitest run --config vitest.config.integration.ts",
    "test:api": "vitest run --config vitest.config.api.ts",
    "test:api:watch": "vitest --config vitest.config.api.ts",
    "test:api:reseed": "npm run reseed:test && vitest run --config vitest.config.api.ts",
    "test:e2e": "vitest run --config vitest.config.e2e.ts",
    "test:e2e:watch": "vitest --config vitest.config.e2e.ts",
    "test:e2e:reseed": "npm run reseed:test && vitest run --config vitest.config.e2e.ts"
  }
}
```

### 3. Setup Files

#### test/setup.ts (Base Setup)

```typescript
import { beforeAll } from 'vitest'

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test'
})
```

#### test/setup-e2e.ts (E2E Setup)

```typescript
import { beforeAll, afterAll } from 'vitest'

beforeAll(() => {
  process.env.NODE_ENV = 'test'
})

afterAll(() => {
  // Cleanup if needed
})
```

### 4. Test File Updates

**No changes required!** Vitest is Jest-compatible:

```typescript
// Existing test - works as-is
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { TestUtils } from '../utils/test-utils'

describe('Player functionality (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await TestUtils.createApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register and login player', async () => {
    // Test code remains unchanged
  })
})
```

### 5. Dependencies

#### Remove (Jest-related)

```json
{
  "devDependencies": {
    "jest": "^30.2.0",
    "jest-mock": "^30.2.0",
    "jest-mock-extended": "^4.0.0",
    "ts-jest": "^29.4.5",
    "@types/jest": "30.0.0"
  }
}
```

#### Add (Vitest)

```json
{
  "devDependencies": {
    "vitest": "^1.6.0",
    "@vitest/ui": "^1.6.0",
    "@vitest/coverage-v8": "^1.6.0"
  }
}
```

## Data Models

No data model changes required. Tests interact with the same entities and DTOs.

## Error Handling

### Migration Errors

**Issue**: Tests fail to import modules

- **Solution**: Check that `"type": "module"` is in package.json
- **Solution**: Verify no `.js` extension issues in imports

**Issue**: TypeORM connection fails

- **Solution**: Verify test environment configuration in ormconfig.ts
- **Solution**: Check that synchronize: true is set for test environment

**Issue**: Mock functions not working

- **Solution**: Update from `jest.fn()` to `vi.fn()`
- **Solution**: Update from `jest.mock()` to `vi.mock()`

### Runtime Errors

**Issue**: Tests timeout

- **Solution**: Increase testTimeout in vitest config
- **Solution**: Ensure proper cleanup in afterAll hooks

**Issue**: Database connection pool exhaustion

- **Solution**: Use `pool: 'forks'` with `singleFork: true` for E2E tests
- **Solution**: Ensure app.close() is called in afterAll

## Testing Strategy

### Migration Testing Approach

1. **Phase 1: Install and Configure**
   - Install Vitest dependencies
   - Create configuration files
   - Update package.json scripts

2. **Phase 2: Migrate Unit Tests**
   - Run unit tests with Vitest
   - Fix any import issues
   - Verify all tests pass

3. **Phase 3: Migrate Integration Tests**
   - Run integration tests with Vitest
   - Verify database connections work
   - Ensure test isolation

4. **Phase 4: Migrate API Tests**
   - Run API tests with Vitest
   - Verify HTTP testing works
   - Check test helpers function correctly

5. **Phase 5: Migrate E2E Tests**
   - Run E2E tests with Vitest
   - Verify TypeORM SQLite dynamic imports work
   - Confirm full application initialization

6. **Phase 6: Cleanup**
   - Remove Jest dependencies
   - Delete Jest configuration files
   - Update documentation

### Validation Criteria

- All existing tests pass without modification
- E2E tests successfully connect to SQLite database
- Test execution is faster than Jest
- Coverage reports generate correctly
- Watch mode works with hot reload

## Performance Considerations

### Expected Improvements

- **Initial test run**: 30-50% faster (Vite's optimized transformation)
- **Watch mode**: 80-90% faster (hot module reload, no full retransformation)
- **Coverage generation**: Similar speed (both use v8)

### Optimization Strategies

1. **Use test pooling**: Configure `pool: 'forks'` for isolated tests
2. **Enable caching**: Vite automatically caches transformations
3. **Parallel execution**: Vitest runs tests in parallel by default
4. **Selective test runs**: Use `--changed` flag to run only affected tests

## TypeScript Configuration

**No separate test tsconfig needed!**

Unlike Jest (which required `tsconfig.jest.json`), Vitest uses your main `tsconfig.json` directly. The existing configuration with:

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "ES2020"
  }
}
```

...works perfectly with Vitest's ESM transformation.

**What to remove from tsconfig.json:**

- Remove `"@types/jest"` from types array (if present)
- Add `"@types/node"` if not already present
- No other changes needed

## Migration Checklist

- [ ] Install Vitest dependencies
- [ ] Create vitest.config.ts files
- [ ] Update package.json scripts
- [ ] Create setup files
- [ ] Run unit tests and verify
- [ ] Run integration tests and verify
- [ ] Run API tests and verify
- [ ] Run E2E tests and verify SQLite works
- [ ] Generate coverage report
- [ ] Test watch mode
- [ ] Test UI mode
- [ ] Remove Jest dependencies
- [ ] Delete jest.config.js files
- [ ] Delete test/jest-e2e.json
- [ ] Delete tsconfig.jest.json (no longer needed!)
- [ ] Update tsconfig.json (remove jest types)
- [ ] Update README/documentation
- [ ] Commit changes

## Rollback Plan

If migration fails:

1. Revert package.json changes
2. Restore Jest configuration files
3. Run `npm install` to restore Jest dependencies
4. Verify tests run with Jest
5. Document issues encountered for future attempt

## Future Enhancements

- **Snapshot testing**: Use Vitest's built-in snapshot support
- **Benchmark tests**: Use Vitest's bench API for performance testing
- **In-source testing**: Co-locate tests with source files
- **Browser testing**: Use @vitest/browser for frontend testing (if needed)
