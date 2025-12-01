# Requirements Document

## Introduction

This feature addresses security concerns by migrating hardcoded configuration values (database credentials, JWT secrets) to environment variables. Currently, sensitive values are committed to the repository in `ormconfig.ts` and `src/constants.ts`, which poses security risks. The system will be updated to read these values from environment variables, allowing different configurations per environment without exposing secrets in version control.

## Glossary

- **Configuration System**: The TypeORM and application configuration modules that define database connections and application settings
- **Environment Variables**: System-level variables loaded from `.env` files or the operating system environment
- **JWT Secret**: The cryptographic key used to sign and verify JSON Web Tokens for authentication
- **Database Credentials**: Connection parameters including host, port, username, password, and database name
- **Production Environment**: The live deployment environment running at openworld.heimerman.org

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want database credentials to be loaded from environment variables, so that sensitive connection information is not committed to version control

#### Acceptance Criteria

1. WHEN the Configuration System initializes, THE Configuration System SHALL read database host from the environment variable `DB_HOST`
2. WHEN the Configuration System initializes, THE Configuration System SHALL read database port from the environment variable `DB_PORT`
3. WHEN the Configuration System initializes, THE Configuration System SHALL read database username from the environment variable `DB_USERNAME`
4. WHEN the Configuration System initializes, THE Configuration System SHALL read database password from the environment variable `DB_PASSWORD`
5. WHEN the Configuration System initializes, THE Configuration System SHALL read database name from the environment variable `DB_NAME`

### Requirement 2

**User Story:** As a system administrator, I want the JWT secret to be loaded from an environment variable, so that the authentication key is not exposed in the codebase

#### Acceptance Criteria

1. WHEN the Configuration System initializes, THE Configuration System SHALL read the JWT secret from the environment variable `JWT_SECRET`
2. WHEN the environment variable `JWT_SECRET` is not defined, THE Configuration System SHALL throw an error indicating the missing required configuration
3. THE Configuration System SHALL use the JWT secret value for all token signing and verification operations

### Requirement 3

**User Story:** As a developer, I want environment-specific configuration files that provide default values for development and test environments, so that local development works without manual environment setup

#### Acceptance Criteria

1. WHEN the application runs in development mode, THE Configuration System SHALL load environment variables from `config/.env.dev`
2. WHEN the application runs in test mode, THE Configuration System SHALL load environment variables from `config/.env.test`
3. WHERE the application runs in production mode, THE Configuration System SHALL load environment variables from the operating system environment
4. THE Configuration System SHALL provide sensible default values for development database configuration in `config/.env.dev`
5. THE Configuration System SHALL provide sensible default values for test database configuration in `config/.env.test`

### Requirement 4

**User Story:** As a system administrator, I want clear documentation on required environment variables for production deployment, so that I can properly configure the production environment

#### Acceptance Criteria

1. THE Configuration System SHALL document all required environment variables in the deployment guide
2. THE Configuration System SHALL document the format and expected values for each environment variable
3. THE Configuration System SHALL provide example values for non-sensitive configuration parameters
4. THE Configuration System SHALL include instructions for setting environment variables in the PM2 ecosystem configuration

### Requirement 5

**User Story:** As a system administrator, I want all previously exposed credentials to be rotated, so that the security vulnerability from committing secrets to the public repository is fully remediated

#### Acceptance Criteria

1. THE Configuration System SHALL require a new JWT secret value different from the previously committed value `secretKey`
2. THE Configuration System SHALL require a new production database password different from any previously committed values
3. THE Configuration System SHALL document the credential rotation requirement in the deployment guide
4. THE Configuration System SHALL include instructions for updating credentials in the production environment

### Requirement 6

**User Story:** As a developer, I want the existing `.env` file loading mechanism to continue working, so that the migration to environment variables does not break existing functionality

#### Acceptance Criteria

1. WHEN environment variables are loaded, THE Configuration System SHALL use the existing `dotenv` package mechanism
2. THE Configuration System SHALL maintain compatibility with the current `NODE_ENV` based environment selection
3. THE Configuration System SHALL preserve the existing TypeORM configuration structure
4. WHEN an environment variable is not defined and no default exists, THE Configuration System SHALL provide a clear error message indicating which variable is missing
