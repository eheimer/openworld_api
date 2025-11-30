# Design Document

## Overview

This design implements an in-memory SQLite database strategy for E2E and API tests in the Openworld API project. The solution eliminates file-based database operations during testing, improving test execution speed and reliability while maintaining full compatibility with the ES module system and existing test patterns.

The design focuses on minimal changes to existing test files while providing a centralized, reusable database setup mechanism that ensures test isolation and proper cleanup.

## Architecture

### High-Level Architecture

```
Test Suite Execution
    ↓
Test Setup (beforeAll)
    ↓
In-Memory Database Creation
    ↓
TypeORM Initialization with :memory:
    ↓
Migration Execution (DDL + DML)
    ↓
NestJS App Bootstrap
    ↓
Test Execution
    ↓
Test Teardown (afterAll)
    ↓
Database Disposal
```

### Key Design Decisions

1. **In-Memory Database Configuration**: Use SQLite's `:memory:` database instead of file-based storage
2. **Centralized Setup**: Create a single test database utility module that handles all database initialization
3. **Migration-Based Seeding**: Continue using TypeORM migrations for schema and data setup
4. **Minimal Test Changes**: Existing test files require minimal or no modifications
5. **Environment Isolation**: Test configuration remains separate from dev/prod configurations

## Components and Interfaces

### 1. Test Database Configuration Module

**Location**: `test/config/test-database.config.ts`

**Purpose**: Provides TypeORM configuration specifically for in-memory testing

**Interface**:

```typescript
export function getTestDatabaseConfig(): DataSourceOptions {
  return {
    type: 'sqlite',
    database: ':memory:', // In-memory database
    synchronize: false, // Use migrations instead
    logging: false,
    entities: ['src/**/*.entity.ts'],
    subscribers: ['src/**/*.subscriber.ts'],
    migrations: ['migration/DDL/*.ts', 'migration/DML/*.ts'],
    migrationsRun: true // Auto-run migrations on connection
  }
}
```

**Key Features**:

- Returns configuration object for in-memory SQLite
- Includes all entity and subscriber paths
- Configures automatic migration execution
- Disables logging for cleaner test output

### 2. Test Database Setup Utility

**Location**: `test/utils/test-database-setup.ts`

**Purpose**: Handles database initialization and cleanup for test suites

**Interface**:

```typescript
export class TestDatabaseSetup {
  private static dataSource: DataSource | null = null

  /**
   * Initialize in-memory database with migrations
   * Call this in beforeAll() hooks
   */
  static async initialize(): Promise<DataSource> {
    const config = getTestDatabaseConfig()
    this.dataSource = new DataSource(config)
    await this.dataSource.initialize()
    return this.dataSource
  }

  /**
   * Clean up database connection
   * Call this in afterAll() hooks
   */
  static async cleanup(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy()
      this.dataSource = null
    }
  }

  /**
   * Get current data source instance
   */
  static getDataSource(): DataSource {
    if (!this.dataSource) {
      throw new Error('Database not initialized')
    }
    return this.dataSource
  }
}
```

**Key Features**:

- Singleton pattern for data source management
- Automatic migration execution during initialization
- Proper cleanup to prevent memory leaks
- Error handling for uninitialized access

### 3. Enhanced Test Utilities

**Location**: `test/api/helpers/util.ts` (modifications)

**Purpose**: Update existing test utilities to use in-memory database

**Changes**:

```typescript
export async function createApp(): Promise<INestApplication> {
  // Initialize in-memory database before creating app
  await TestDatabaseSetup.initialize()

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = moduleFixture.createNestApplication()
  await app.init()
  return app
}
```

**Key Features**:

- Transparent database initialization
- No changes required to existing test files
- Maintains existing API

### 4. Environment Configuration Updates

**Location**: `ormconfig.ts` (modifications)

**Purpose**: Support in-memory database configuration for tests

**Changes**:

```typescript
const dbConfig = {
  test: {
    type: 'sqlite',
    database: process.env.DB_NAME || ':memory:', // Default to in-memory
    synchronize: false, // Use migrations
    logging: false,
    entities: [`src/**/*.entity.ts`],
    subscribers: [`src/**/*.subscriber.ts`]
  }
  // ... other environments
}
```

**Key Features**:

- Defaults to in-memory for test environment
- Allows override via DB_NAME environment variable
- Maintains backward compatibility

### 5. Jest Configuration Updates

**Location**: `test/jest-e2e.json` and `jest.config.js`

**Purpose**: Ensure proper test environment setup

**Changes**:

- Update `setupFilesAfterEnv` to include database setup
- Ensure proper module resolution for TypeORM
- Configure test timeout for migration execution

## Data Models

### Database Lifecycle

```
Test Suite Start
    ↓
[In-Memory Database Created]
    ↓
[Schema Created via DDL Migrations]
    ↓
[Data Seeded via DML Migrations]
    ↓
[Tests Execute with Full Database]
    ↓
[Database Destroyed]
Test Suite End
```

### Migration Execution Order

1. **DDL Migrations** (Schema): Execute in timestamp order
   - Create tables
   - Add columns
   - Create indexes
   - Define relationships

2. **DML Migrations** (Data): Execute in timestamp order
   - Seed reference data
   - Create test fixtures
   - Populate lookup tables

## Error Handling

### Database Initialization Failures

**Scenario**: Migration fails during initialization

**Handling**:

```typescript
try {
  await TestDatabaseSetup.initialize()
} catch (error) {
  console.error('Failed to initialize test database:', error)
  throw new Error(`Database setup failed: ${error.message}`)
}
```

**Recovery**: Test suite fails fast with clear error message

### Connection Cleanup Failures

**Scenario**: Database connection fails to close

**Handling**:

```typescript
try {
  await TestDatabaseSetup.cleanup()
} catch (error) {
  console.warn('Failed to cleanup database:', error)
  // Continue - in-memory database will be garbage collected
}
```

**Recovery**: Log warning but allow test suite to complete

### TypeORM Module Conflicts

**Scenario**: Multiple TypeORM instances in test environment

**Handling**:

- Use singleton pattern for DataSource
- Ensure single initialization per test suite
- Clear module cache if needed

**Recovery**: Reinitialize with fresh DataSource

## Testing Strategy

### Unit Test Approach

**Scope**: Test individual components of the database setup utility

**Tests**:

1. Configuration generation returns valid TypeORM options
2. Initialize creates DataSource with correct settings
3. Cleanup properly destroys connections
4. Error handling works for invalid configurations

### Integration Test Approach

**Scope**: Test database setup with actual NestJS application

**Tests**:

1. App initializes with in-memory database
2. Migrations execute successfully
3. Entities are properly registered
4. CRUD operations work correctly
5. Multiple test suites can run in parallel

### E2E Test Approach

**Scope**: Verify existing E2E tests work with new setup

**Tests**:

1. All existing E2E tests pass without modification
2. Test isolation is maintained between suites
3. No database files are created
4. Performance is acceptable

### Test Execution Flow

```typescript
describe('Example Test Suite', () => {
  let app: INestApplication

  beforeAll(async () => {
    // Database initialized automatically by createApp()
    app = await TestUtils.createApp()
  })

  afterAll(async () => {
    await app.close()
    // Database cleanup happens automatically
  })

  it('should work with in-memory database', async () => {
    // Test code unchanged
  })
})
```

## Performance Considerations

### Memory Usage

- **In-Memory Database**: Each test suite creates a fresh database in RAM
- **Estimated Size**: ~10-50MB per database instance depending on seed data
- **Mitigation**: Run test suites sequentially if memory is constrained

### Execution Speed

- **File I/O Elimination**: No disk writes during test execution
- **Migration Overhead**: One-time cost per test suite (~1-2 seconds)
- **Expected Improvement**: 30-50% faster than file-based approach

### Parallel Execution

- **Isolation**: Each test suite has independent database
- **No Conflicts**: No file locking or race conditions
- **Scalability**: Limited only by available memory

## Migration Path

### Phase 1: Setup Infrastructure

1. Create test database configuration module
2. Implement test database setup utility
3. Update environment configuration

### Phase 2: Update Test Utilities

1. Modify `createApp()` function
2. Add database lifecycle management
3. Update setup files

### Phase 3: Validation

1. Run existing E2E tests
2. Run existing API tests
3. Verify no database files created
4. Measure performance improvements

### Phase 4: Documentation

1. Update test documentation
2. Add inline code comments
3. Create troubleshooting guide

## Rollback Strategy

If issues arise, rollback is straightforward:

1. Revert `ormconfig.ts` to use file-based database
2. Remove test database setup utility imports
3. Restore original `createApp()` implementation
4. Delete new test configuration files

The design maintains backward compatibility, allowing gradual migration or quick rollback if needed.

## Dependencies

### Required Packages

- `typeorm` - Already installed
- `sqlite3` - Already installed
- `@nestjs/typeorm` - Already installed

### No New Dependencies Required

All necessary packages are already part of the project. The solution uses existing infrastructure in a new configuration.

## Security Considerations

### Test Data Isolation

- In-memory databases are process-isolated
- No persistent test data on disk
- Automatic cleanup prevents data leakage

### Credential Management

- Test environment uses no-password SQLite
- No production credentials in test configuration
- Environment variables remain separate

## Monitoring and Debugging

### Logging Strategy

- Database initialization logs to console in verbose mode
- Migration execution can be logged via TypeORM logging option
- Test failures include database state information

### Debug Mode

Enable detailed logging:

```typescript
const config = getTestDatabaseConfig()
config.logging = ['query', 'error', 'schema', 'warn', 'info', 'log']
```

### Troubleshooting

Common issues and solutions:

1. **Migrations fail**: Check migration file syntax and dependencies
2. **Entities not found**: Verify entity paths in configuration
3. **Memory issues**: Reduce parallel test execution
4. **Timeout errors**: Increase Jest timeout for migration-heavy suites
