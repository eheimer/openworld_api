# Technology Stack

## Framework & Runtime

- **NestJS** - Primary application framework
- **Node.js** - Runtime environment (ES2020 target)
- **TypeScript** - Language (CommonJS modules)
- **Express** - HTTP server (via NestJS platform)

## Database & ORM

- **TypeORM** - ORM for database operations
- **MySQL** - Production database (mysql2 driver)
- **SQLite** - Development and test database (sqlite3)

## Authentication & Security

- **Passport** - Authentication middleware
- **JWT** - Token-based authentication (passport-jwt)
- **Local Strategy** - Username/password authentication (passport-local)

## Validation & Serialization

- **class-validator** - DTO validation
- **class-transformer** - Object serialization/deserialization

## API Documentation

- **Swagger/OpenAPI** - API documentation (@nestjs/swagger)
- Spec generated at `dist/openapi.json`

## Testing

- **Jest** - Test framework
- **Supertest** - HTTP testing
- Test types: unit, integration, e2e, api

## Code Quality

- **ESLint** - Linting with TypeScript plugin
- **Prettier** - Code formatting
  - No semicolons
  - Single quotes
  - 120 character line width
  - No trailing commas

## Common Commands

### Development

```bash
npm run start:dev              # Start with watch mode
npm run start:dev:reseed       # Reseed database and start
npm run start:debug            # Start with debugger
```

### Building

```bash
npm run build                  # Compile TypeScript to dist/
npm run format                 # Format code with Prettier
npm run lint                   # Lint and fix code
```

### Testing

```bash
npm run test                   # Run unit tests
npm run test:watch             # Run tests in watch mode
npm run test:cov               # Run tests with coverage
npm run test:e2e               # Run end-to-end tests
npm run test:e2e:reseed        # Reseed and run e2e tests
npm run test:api               # Run API tests
npm run test:integration       # Run integration tests
```

### Database

```bash
npm run migration:run                            # Run pending migrations
npm run migration:generate migration/DDL/<name>  # Generate migration from entity changes
npm run migration:create migration/DML/<name>    # Create empty migration
npm run reseed:dev                               # Drop, sync, and migrate dev database
npm run reseed:test                              # Drop, sync, and migrate test database
```

**Note:** When generating or creating migrations, you must include the `migration/DDL/` or `migration/DML/` directory prefix as part of the name parameter due to TypeORM CLI behavior.

## Module System

- **Uses CommonJS** - Standard for NestJS/TypeORM projects
- Module resolution: `node` (not `nodenext`)
- TypeScript compiles to CommonJS (`module: "commonjs"`)
- Import statements use TypeScript extensions (`.ts`), not runtime extensions (`.js`)
- **DO NOT migrate to ES modules** - CommonJS is the correct choice for this stack:
  - NestJS decorators and DI work best with CommonJS
  - TypeORM entity loading is more reliable with CommonJS
  - Jest testing has better CommonJS support
  - Avoids complex async import issues with dynamic entity loading
