# Design Document

## Overview

This design migrates hardcoded configuration values to environment variables, addressing security vulnerabilities where sensitive credentials (database passwords, JWT secrets) are committed to the public GitHub repository. The solution leverages the existing `dotenv-extended` package already in the project dependencies to load environment variables from `.env` files in development/test, while production reads from system environment variables set via PM2.

The design maintains backward compatibility with the existing configuration structure while adding environment variable support. All sensitive values will be rotated as part of the deployment to remediate the exposure.

## Architecture

### Configuration Loading Flow

```
Application Start
    ↓
Load .env file (dev/test only)
    ↓
Read environment variables
    ↓
Apply defaults for missing values
    ↓
Validate required variables
    ↓
Build TypeORM config object
    ↓
Export configuration
```

### Environment Variable Strategy

**Development/Test Environments:**
- Use `dotenv-extended` to load from `config/.env.dev` or `config/.env.test`
- Provide sensible defaults for local development (SQLite databases)
- Allow developers to work without manual environment setup
- These files are committed to git (contain only non-sensitive defaults)

**Production Environment:**
- Use `dotenv-extended` to load from `/opt/openworld-api/.env.prod` on production server
- This file is NOT committed to git (contains sensitive credentials)
- File has restrictive permissions (600) readable only by application user
- No defaults for sensitive values (fail fast if missing)
- Require explicit configuration for all production settings

## Components and Interfaces

### 1. Environment Variable Loader (`src/config/env.ts`)

**Purpose:** Centralized module for loading and validating environment variables

**Responsibilities:**
- Load `.env` files in non-production environments
- Provide type-safe access to environment variables
- Validate required variables are present
- Provide clear error messages for missing configuration

**Interface:**
```typescript
interface EnvironmentConfig {
  nodeEnv: string
  database: {
    type: 'mysql' | 'sqlite'
    host?: string
    port?: number
    username?: string
    password?: string
    database: string
  }
  jwt: {
    secret: string
  }
}

export function loadEnvironmentConfig(): EnvironmentConfig
```

**Implementation Details:**
- Use `dotenv-extended` with `path` option based on `NODE_ENV`:
  - `dev`: `config/.env.dev` (committed to git)
  - `test`: `config/.env.test` (committed to git)
  - `prod`: `/opt/openworld-api/.env.prod` (NOT committed to git)
- Throw descriptive errors for missing required variables
- Parse numeric values (port) from string environment variables
- Provide SQLite defaults for dev/test, no defaults for production MySQL

### 2. Updated TypeORM Configuration (`ormconfig.ts`)

**Purpose:** Database configuration using environment variables

**Changes:**
- Import and use `loadEnvironmentConfig()` function
- Replace hardcoded values with environment variable references
- Maintain existing structure for TypeORM compatibility
- Preserve CLI-specific configuration logic
- Keep environment-specific entity/subscriber paths

**Configuration Mapping:**
```
DB_TYPE          → type (mysql/sqlite)
DB_HOST          → host
DB_PORT          → port
DB_USERNAME      → username
DB_PASSWORD      → password
DB_NAME          → database
```

### 3. Updated JWT Constants (`src/constants.ts`)

**Purpose:** JWT configuration using environment variables

**Changes:**
- Import and use `loadEnvironmentConfig()` function
- Replace hardcoded 'secretKey' with `JWT_SECRET` environment variable
- Throw error if `JWT_SECRET` is not defined

### 4. Environment Configuration Files

**`config/.env.dev`:**
```bash
NODE_ENV=dev
DB_TYPE=sqlite
DB_NAME=dev.sqlite
JWT_SECRET=dev-secret-key-not-for-production
```

**`config/.env.test`:**
```bash
NODE_ENV=test
DB_TYPE=sqlite
DB_NAME=test.sqlite
JWT_SECRET=test-secret-key-not-for-production
```

**Production (System Environment Variables):**

Environment variables will be set directly on the production server, not in committed files. Two approaches:

**Option A: PM2 Environment File (Recommended)**
- Create `/opt/openworld-api/.env.prod` on production server (not committed to git)
- Set restrictive permissions: `chmod 600 /opt/openworld-api/.env.prod`
- Update `ecosystem.config.js` to reference this file using `env_file` option
- Keep `ecosystem.config.js` in git with only non-sensitive values

**Option B: System Environment Variables**
- Set variables in `/etc/environment` or systemd service file
- PM2 inherits from system environment
- Keep `ecosystem.config.js` in git with only non-sensitive values

**Recommended `.env.prod` content (not committed):**
```bash
NODE_ENV=prod
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=openworld
DB_PASSWORD=[NEW_SECURE_PASSWORD]
DB_NAME=openworld
JWT_SECRET=[NEW_SECURE_JWT_SECRET]
```

**Updated `ecosystem.config.js` (committed to git):**
```javascript
env: {
  NODE_ENV: 'prod',
  PORT: 3000
}
// Sensitive variables loaded from /opt/openworld-api/.env.prod
```

## Data Models

No database schema changes required. This is purely a configuration refactoring.

## Error Handling

### Missing Required Variables

**Development/Test:**
- Provide defaults for most values
- Only require `JWT_SECRET` (can use dev/test default)
- Log warnings for missing optional variables

**Production:**
- Require all database connection variables: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- Require `JWT_SECRET`
- Throw descriptive error immediately on startup if any required variable is missing
- Error message format: `"Missing required environment variable: {VARIABLE_NAME}"`

### Invalid Variable Values

- Validate `DB_TYPE` is either 'mysql' or 'sqlite'
- Validate `DB_PORT` is a valid number
- Validate `JWT_SECRET` is at least 32 characters in production
- Throw descriptive errors for invalid values

### Backward Compatibility

- Existing code that imports `dbconfig` continues to work unchanged
- Existing code that imports `jwtConstants` continues to work unchanged
- No changes required to services, controllers, or other modules
- TypeORM integration remains identical

## Testing Strategy

### Unit Tests

**Environment Loader Tests (`src/config/env.spec.ts`):**
- Test loading with all variables present
- Test loading with missing optional variables (uses defaults)
- Test loading with missing required variables (throws error)
- Test loading in different NODE_ENV values
- Test validation of variable types and formats
- Test error messages are descriptive

**Configuration Tests:**
- Test `ormconfig.ts` exports correct structure
- Test `constants.ts` exports correct structure
- Mock environment variables for different scenarios

### Integration Tests

**Database Connection:**
- Test application starts successfully with valid environment variables
- Test application fails gracefully with missing required variables
- Test database connection works with environment-based configuration

**Authentication:**
- Test JWT signing and verification works with environment-based secret
- Test tokens generated with new secret are valid

### Manual Testing

**Development Environment:**
1. Delete any existing `.env` files
2. Run `npm run start:dev` - should work with defaults
3. Verify SQLite database is created
4. Verify authentication endpoints work

**Test Environment:**
1. Run `npm run test:e2e` - should work with test configuration
2. Verify test database is isolated
3. Verify all tests pass

**Production Simulation:**
1. Set `NODE_ENV=prod` locally
2. Set all required environment variables
3. Run `npm run start` - should connect to specified database
4. Verify no `.env` file is loaded

## Deployment Plan

### Phase 1: Code Changes
1. Create `src/config/env.ts` with environment loader
2. Update `ormconfig.ts` to use environment variables
3. Update `src/constants.ts` to use environment variables
4. Update `config/.env.dev` with all required variables
5. Update `config/.env.test` with all required variables
6. Add unit tests for environment loader
7. Run existing test suite to verify no regressions

### Phase 2: Documentation
1. Update `deployment/DEPLOYMENT_GUIDE.md` with environment variable requirements
2. Update `deployment/MAINTENANCE.md` with credential rotation instructions
3. Document all environment variables and their purposes
4. Provide example values for non-sensitive variables

### Phase 3: Production Deployment
1. Generate new secure JWT secret (minimum 64 characters, cryptographically random)
2. Create new MySQL database password (minimum 32 characters, cryptographically random)
3. Update MySQL user password on production database server
4. Create `/opt/openworld-api/.env.prod` on production server with new credentials
5. Set restrictive permissions: `chmod 600 /opt/openworld-api/.env.prod`
6. Update environment loader to support `.env.prod` file in production
7. Deploy code changes to production
8. Restart PM2 process
9. Verify application starts successfully
10. Test authentication endpoints
11. Test database connectivity
12. Monitor logs for any configuration errors
13. Verify `.env.prod` is NOT committed to git (add to `.gitignore` if needed)

### Phase 4: Cleanup
1. Remove old hardcoded credentials from documentation (if any)
2. Verify `*.env.prod` is in `.gitignore`
3. Verify no sensitive values remain in repository
4. Document the production `.env.prod` file location and permissions in deployment guide

## Security Considerations

### Credential Rotation

**JWT Secret:**
- Old value: `secretKey` (exposed in public repo)
- New value: Generate using `openssl rand -base64 64`
- Minimum length: 64 characters
- Must be different from any previously committed value

**Database Password:**
- Old value: `entranced` (exposed in public repo)
- New value: Generate using `openssl rand -base64 32`
- Minimum length: 32 characters
- Must be different from any previously committed value
- Update on MySQL server: `ALTER USER 'openworld'@'localhost' IDENTIFIED BY 'new_password';`

### Environment Variable Security

**Development/Test:**
- `.env.dev` and `.env.test` can contain non-sensitive defaults
- These files are committed to repository
- Use obviously non-production values (e.g., "dev-secret-key-not-for-production")

**Production:**
- Never commit `.env.prod` or any file containing production secrets
- Add `*.env.prod` to `.gitignore` to prevent accidental commits
- Production `.env.prod` file stored at `/opt/openworld-api/.env.prod`
- File permissions set to 600 (readable only by application owner)
- File owned by the user running the PM2 process
- Consider using external secret management (AWS Secrets Manager, Vault) in future

### Git History

**Important:** The old credentials are already in Git history and cannot be removed without rewriting history (not recommended for public repos). The security remediation is:
1. Rotate all exposed credentials immediately
2. Monitor for any unauthorized access using old credentials
3. Consider the old credentials permanently compromised
4. Document the incident and remediation in security log

## Migration Impact

### Breaking Changes

**None for existing deployments** - The changes are backward compatible at the code level.

**For new deployments:**
- Must set environment variables before starting application
- Application will fail to start if required variables are missing (fail-fast behavior)

### Developer Impact

**Minimal:**
- Existing local development continues to work with defaults
- No manual environment setup required for dev/test
- Clear error messages if configuration is missing

### Operations Impact

**Production deployment requires:**
1. One-time setup of environment variables in PM2 config
2. One-time credential rotation on database server
3. Application restart to load new configuration
4. Brief downtime during restart (< 30 seconds)

## Future Enhancements

1. **External Secret Management:** Integrate with AWS Secrets Manager, HashiCorp Vault, or similar
2. **Configuration Validation:** Add JSON schema validation for environment variables
3. **Hot Reload:** Support configuration changes without restart (where safe)
4. **Audit Logging:** Log configuration changes and access to sensitive values
5. **Multiple Environments:** Support staging, QA, and other environments beyond dev/test/prod
