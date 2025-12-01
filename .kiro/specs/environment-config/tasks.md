# Implementation Plan

- [x] 1. Create environment variable loader module
  - Create `src/config/env.ts` with environment loading and validation logic
  - Implement `loadEnvironmentConfig()` function that loads `.env` files based on NODE_ENV
  - Add validation for required variables with descriptive error messages
  - Add type definitions for environment configuration structure
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.4_

- [x] 2. Update database configuration to use environment variables
  - Modify `ormconfig.ts` to import and use `loadEnvironmentConfig()`
  - Replace hardcoded database credentials with environment variable references
  - Maintain existing TypeORM configuration structure and CLI logic
  - Preserve environment-specific entity/subscriber paths
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.2, 6.3_

- [x] 3. Update JWT configuration to use environment variables
  - Modify `src/constants.ts` to import and use `loadEnvironmentConfig()`
  - Replace hardcoded 'secretKey' with JWT_SECRET environment variable
  - Add validation that JWT_SECRET is defined
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. Update development environment configuration file
  - Update `config/.env.dev` with all required environment variables
  - Include non-sensitive default values for local development
  - Add SQLite database configuration
  - Add development JWT secret with clear "not for production" naming
  - _Requirements: 3.1, 3.4_

- [x] 5. Update test environment configuration file
  - Update `config/.env.test` with all required environment variables
  - Include non-sensitive default values for testing
  - Add SQLite test database configuration
  - Add test JWT secret with clear "not for production" naming
  - _Requirements: 3.2, 3.5_

- [x] 6. Update .gitignore to prevent committing production secrets
  - Add `*.env.prod` pattern to `.gitignore`
  - Add `/opt/openworld-api/.env.prod` to `.gitignore`
  - Verify `.env.dev` and `.env.test` are NOT in `.gitignore` (should be committed)
  - _Requirements: 5.1, 5.2_

- [x] 7. Update deployment documentation
  - Update `deployment/DEPLOYMENT_GUIDE.md` with environment variable requirements
  - Document all required environment variables and their purposes
  - Add instructions for creating `/opt/openworld-api/.env.prod` file
  - Add instructions for setting file permissions (chmod 600)
  - Document credential rotation procedures
  - Provide example `.env.prod` template with placeholder values
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.3, 5.4_

- [x] 8. Update maintenance documentation
  - Update `deployment/MAINTENANCE.md` with credential rotation instructions
  - Document how to update environment variables in production
  - Add troubleshooting section for missing environment variables
  - _Requirements: 4.1, 5.3_

- [x] 9. Add unit tests for environment loader
  - Create `src/config/env.spec.ts` with test cases
  - Test loading with all variables present
  - Test loading with missing optional variables
  - Test loading with missing required variables (should throw)
  - Test validation of variable types and formats
  - Test different NODE_ENV values
  - _Requirements: 6.4_

- [x] 10. Verify existing tests pass with new configuration
  - Run unit tests: `npm run test`
  - Run integration tests: `npm run test:integration`
  - Run e2e tests: `npm run test:e2e`
  - Run API tests: `npm run test:api`
  - Fix any test failures related to configuration changes
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 11. Test local development environment
  - Delete any existing local `.env` files
  - Start development server: `npm run start:dev`
  - Verify application starts successfully
  - Verify SQLite database is created
  - Test authentication endpoints (login, JWT verification)
  - Verify database operations work correctly
  - _Requirements: 3.1, 3.4, 6.1_

- [x] 12. Create production environment variable template
  - Create example template file `deployment/.env.prod.example`
  - Include all required production environment variables with placeholder values
  - Add comments explaining each variable
  - Include instructions for generating secure secrets
  - Mark clearly as example/template (not to be used as-is)
  - _Requirements: 4.2, 4.3, 5.1, 5.2_
