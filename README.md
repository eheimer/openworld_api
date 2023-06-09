# openworld_api

Node/Express API for Openworld game

## Welcome to Nestjs!

This project is now fully implemented in the Nestjs framework. Some of the old files
are still hanging out in the nest_migration_reference directory, until the remainder of
the previous functionality has been re-implemented.

[Trello url](https://trello.com/b/XOHPkuwM/development-life-cycle)

## Database schema changes

Database changes are driven by the Entities. After making changes to the entities that you wish to affect the schema, run the `migration:generate` script (see [package.json scripts](#packagejson-scripts) below), using the `migration/DDL` directory parameter. Verify the created file is doing what you expected it to.

Whenever making schema changes, always run tests, start up the server with start:dev:reseed, and run all of the http regression tests to make sure everything is still functioning.

## package.json scripts <a name="scripts"></a>

When using the `npm run migration:run` command, the typeorm cli will look in the `migration/` directory for any new migration files.

Because of some weird flaw in the cli, when using the `migration:generate` or `migration:create` commands, it will not create the migration scripts in the proper directory as specified in the ormconfig. As such...

when running the `npm run migration:generate` command, you must specify the `migration/` directory as part of the migration name, e.g. `npm run migration:generate migration/test-migration`

Also, by convention, I have been splitting the migration scripts between DDL and DML subdirectories

## Nestjs cli

To create a new module, run the `nest g resource {plural_name}` command. This will generate the directory, module, controller, service, and entity stub files

## Data Flow

- player logs in (HTTP)
  - if successful, they get their playerId and a token
  - token: must be stored by the client and sent in the auth header of each subsequent HTTP request and as a "token" property in each socket message
- player joins (or creates) a game (HTTP)
  - socket namespace is created (if it didn't already exist) with the id of the game
  - message is sent to the namespace of player joining (SOCKET)
- player enters (or creates) a battle (HTTP)
  - socket room is created (if it didn't already exist) with the id of the battle
  - message is sent to the room of player joining (SOCKET)

**_NOTES:_**

- Generally, when the client needs to request data from the server, it will be done via an AJAX request to an HTTP endpoint.

- If the client just needs to update the server and doesn't need to wait for a response, that will be done via a socket message.

## Coding Standards

### Directory Structure

- `/config` _app startup configuration_
- `/dist` _compiled javascript_
- `/migration` _typeorm migration scripts_
- `/node_modules` _required dependencies_
- `src` _typescript code_

  - `/{module_name}` _Nestjs module directory_
    - `/dto` _json-serializable objects used by this module for api responses_
    - `/entities` _typeorm enitities for this module_
    - `{module_name}.controller.ts` _main controller file for this module_
    - `{module_name}.module.ts` _main module file for this module_
    - `{module_name}.service.ts` _main service file for this module_
    - `{module_name}.*.spec.ts` _jest test files_
  - `/common` _general utility classes usable by modules_
  - `/config` _general configuration classes usable by modules_
  - `/decorators` _custom typescript decorator definitions_
  - `/guards` _authorization guards used by module controllers_
  - `/interceptors` _interceptors used by module controllers_
  - `app.module.ts` _the core nestjs module_
  - `main.ts` _nestjs startup script_
  - `requests.http` _api rest testing file_

- `/test` _jest integration tests_
- `ormconfig.ts` _typeorm config file for the nest app_
- `ormDataSource.ts` _a modified typeorm config for use by the typeorm cli_

### Logic Separation

Method call flow:

`Request -> Controller -> Service -> Factory -> [Repository] -> [Entity]`

#### Controllers

- are strictly responsible for receiving and parsing requests, passing
  the data off to appropriate services, and parsing and returning data
  back in the response.
- req/res should be processed here, and not passed directly to services
- should not deal directly with factories and repositories
- all data sent back to the client should be packaged in the form of a
  response dto object

#### Services

- encapsulate the vast bulk of the game logic
- responsible for all error logging
- need to know nothing about the request or response

#### Factories

- should be used for creating/building entities, as well as mock
  data for tests.

#### Repositories

- should contain all database logic for retrieval of records,
  associations, etc.

#### Entities

- should contain entity definitions only
- no logic of any kind

### Entities and DTO notes

- Entities should strictly be used on the server for interfacing with
  the database.
- DTO's are based on the Entities, but are customized to carry data as needed
  between client and server in requests/responses

### Error handling

Error flow:

`Entity -> Repository -> Factory -> Service -> Controller -> Response`

- Entities should catch any errors and rethrow
- Repositories should catch any errors and rethrow
- Factories should catch any errors and rethrow
- Services should log as much detail as necessary to the console and rethrow
- Controllers should package the error into a 500 response to the client.

Service methods are generally the only ones that should be logging to the console. Others will just bubble up the errors to the service. Services will rethrow the errors back to the controller so that the controller can handle what details to present to the client in a 500 response.

## API Testing

API testing for now is done manually via the `src/requests.http` file

## Production Server

**_Migration NOTE:_** _production server is not yet implemented_

Server is running on spinach.heimerman.org as openworld-game.com
Jenkins starts and stops the server as CI builds are run
To manually start/stop the server:

- ssh to spinach.heimerman.org
- `sudo su - jenkins` and enter your password
- `systemctl --user start/stop/status openworld-api`
