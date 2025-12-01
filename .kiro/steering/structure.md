# Project Structure

## Root Directory Layout

```
/config              - Environment configuration files (.env.dev, .env.test)
/dist                - Compiled JavaScript output
/migration           - TypeORM migration scripts
  /DDL               - Data Definition Language (schema changes)
  /DML               - Data Manipulation Language (data seeding)
/src                 - TypeScript source code
/test                - Test files
  /api               - API-level tests
  /end2end           - End-to-end tests
  /integration       - Integration tests
  /unit              - Unit tests
```

## Source Code Organization (`/src`)

### Module Structure

Each feature module follows this pattern:

```
/{module_name}/
  /dto/                          - Data Transfer Objects for API requests/responses
  /entities/                     - TypeORM entity definitions
  /subscribers/                  - TypeORM entity event handlers
  /seed/                         - Seed data for the module (optional)
  {module_name}.controller.ts    - HTTP request handlers
  {module_name}.service.ts       - Business logic
  {module_name}.module.ts        - NestJS module definition
  {module_name}.*.spec.ts        - Jest test files
```

### Core Directories

- `/admin` - Admin functionality (placeholder)
- `/auth` - Authentication (login, JWT)
- `/players` - Player management
- `/games` - Game sessions
  - `/characters` - Character management (nested)
  - `/battles` - Battle system (nested)
- `/monsters` - Monster definitions and instances
- `/items` - Inventory system
  - `/armor` - Armor items
  - `/weapons` - Weapon items
  - `/jewelry` - Jewelry items
  - `/spellbooks` - Spellbook items
- `/conditions` - Status effects
- `/damage-types` - Damage and slayer types
- `/skills` - Character skills
- `/race` - Character races
- `/map` - Map/tile data
- `/compat` - Compatibility layer (placeholder)

### Shared Code

- `/common` - Shared base classes and utilities
- `/config` - Configuration modules
- `/decorators` - Custom TypeScript decorators
- `/guards` - Authorization guards
  - `/authentication` - JWT and local auth guards
  - `/authorization` - Resource ownership guards
- `/interceptors` - Request/response interceptors
- `/middleware` - Express middleware
- `/utils` - Utility services

### Entry Points

- `main.ts` - Application bootstrap
- `app.module.ts` - Root NestJS module

## Architecture Patterns

### Request Flow

```
Request → Controller → Service → Repository → Entity
```

### Responsibility Separation

**Controllers**

- Handle HTTP requests/responses
- Parse and validate input
- Return DTOs (never entities)
- No direct repository access

**Services**

- Contain business logic
- Handle error logging
- Coordinate between repositories
- Use repositories from own module primarily

**Repositories**

- Database query logic
- TypeORM operations
- Used by services in same module

**Entities**

- Database schema definitions only
- Extend `BaseEntity` (id, createdAt, updatedAt)
- No business logic
- Avoid database cascading (use subscribers instead)

**DTOs**

- API request/response objects
- Use `class-validator` decorators
- Use `class-transformer` with `@Expose()` and `@DTO()` decorators
- Never expose entities directly to clients

**Subscribers**

- TypeORM entity event handlers
- Manage cascading logic
- Named pattern: `{entity}-{related-entity}.subscriber.ts`

## Database Migrations

### Migration Organization

- **DDL migrations** (`migration/DDL/`) - Schema changes
- **DML migrations** (`migration/DML/`) - Data seeding

### Migration Workflow

1. Modify entities
2. Generate migration: `npm run migration:generate migration/DDL/<name>`
3. Review generated file
4. Test with reseed: `npm run start:dev:reseed`
5. Run regression tests

### Naming Convention

Migrations use timestamp prefix: `{timestamp}-{description}.ts`

## Testing Strategy

### Test Organization

- Unit tests: Co-located with source (`*.spec.ts`)
- Integration tests: `/test/integration` (currently unused)
- API tests: `/test/api` with helper modules in `/test/api/helpers/`
- E2E tests: `/test/end2end` with `.http` files for manual testing
- Test utilities: `/test/utils` for shared test utilities

## Configuration

### Environment Files

- `config/.env.dev` - Development environment
- `config/.env.test` - Test environment
- Loaded based on `NODE_ENV` variable

### TypeORM Config

- `ormconfig.ts` - Application configuration
- `ormDataSource.ts` - CLI configuration (modified for migrations)

## Code Generation

Use NestJS CLI to scaffold new modules:

```bash
nest g resource {plural_name}
```

This generates: module, controller, service, entity stubs, and directory structure.
