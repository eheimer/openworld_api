# openworld_api

Node/Express API for Openworld game

## OpenAPI

- openapi config has been split into individual files in the config/openapi directory
- before starting the server, or running the generators, this needs to be compiled into
  a single file
- run `npm run bundle:swagger` to build the config/openapi.yaml file.
- all of the generators start from the config/openapi.yaml
  - server-side dto's are built from the components/requestBodies and components/schemas
  - client-side models are then built from the server-side dto's
  - server-side controllers are built from the paths
  - client-side communicator class is built from the paths

## Data flow

- player logs in (HTTP)
  - if successful, they get their playerId and a token
  - token: must be stored by the client and sent in the auth header of each subsequent HTTP request and as a "token" property in each socket message
- player joins (or creates) a game (HTTP)
  - socket namespace is created (if it didn't already exist) with the id of the game
  - message is sent to the namespace of player joining (SOCKET)
- player enters (or creates) a battle (HTTP)
  - socket room is created (if it didn't already exist) with the id of the battle
  - message is sent to the room of player joining (SOCKET)

NOTES: Generally, when the client needs to request data from the server, it will be done via an AJAX request to an HTTP endpoint.  
If the client just needs to update the server and doesn't need to wait for a response, that will be done via a socket message.

## Coding Standards

### directory structure

- `/build` _compiled javascript_
- `/config` _app startup configuration_
- `/coverage` _test coverage reports_
- `/node_modules` _required dependencies_
- `/src` _typescript code_
  - `/api` _all api code_
    - `/controllers` _route controllers_
    - `/dto` _json-serializable objects that exist on both client/server_
    - `/factories` _entity factories_
    - `/models` _typeorm entities_
    - `/repositories` _custom typeorm repositories_
    - `/services` _bulk of game logic_
  - `/config` _api configuration_
  - `/migration` _typeorm migration objects_
  - `/seed` _typeorm seed objects_
  - `/subscriber` _typeorm subscriber objects_
  - `/tests` _all test_
  - `/utils` _utilitiy scripts_
- `/types` _custom type definitions_

### logic separation

Method call flow:

`Request -> Controller -> Service -> Factory -> [Repository] -> [Model]`

#### Controllers

- are strictly responsible for receiving and parsing requests, passing
  the data off to appropriate services, and parsing and returning data
  back in the response.
- req/res should be processed here, and not passed directly to services
- should not deal directly with factories and repositories
- all data sent back to the client should be in the form of a response
  object from /src/api/dto/response

#### Services

- encapsulate the vast bulk of the game logic
- responsible for all error logging
- need to know nothing about the request or response

#### Factories

- should be used for creating/building entities, as well as mock
  data for tests.
- NOTE: Currently, repositories need to be built from an instantiated
  factory. This is not ideal, and should be refactored at some point.

#### Repositories

- should contain all database logic for retrieval of records,
  associations, etc.

#### Models

- should contain entity definitions only
- no logic of any kind

### Model and DTO notes

- Entities should strictly be used on the server for interfacing with
  the database. Care should be taken to keep properties on these
  objects in sync with the DTO objects, for simplicity.
- DTO's are defined in the config/openapi.yml file in the components
  section.
- The TypeScript DTO modules are generated from the openapi spec via
  the `npm run generate:server:models` command
- In order to keep these DTO's in sync between client and server, the
  C# models are generated from the TypeScript modules via the
  `npm run generate:client:entities` command

### error handling

Error flow:

`Model -> Repository -> Factory -> Service -> Controller -> Response`

- Models should catch any errors and rethrow
- Repositories should catch any errors and rethrow
- Factories should catch any errors and rethrow
- Services should log as much detail as necessary to the console and rethrow
- Controllers should package the error into a 500 response to the client.

Service methods are generally the only ones that should be logging to the console. Others will just bubble up the errors to the service. Services will rethrow the errors back to the controller so that the controller can handle what details to present to the client in a 500 response.

## API Testing

API test procedure has been implemented in Postman
