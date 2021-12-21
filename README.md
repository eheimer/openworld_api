# openworld_api

Node/Express API for Openworld game

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

* `/build` *compiled javascript*
* `/config` *app startup configuration*
* `/coverage` *test coverage reports*
* `/node_modules` *required dependencies*
* `/src` *typescript code*
  * `/api` *all api code*
    * `/controllers` *route controllers*
    * `/dto` *json-serializable objects that exist on both client/server*
    * `/factories` *entity factories*
    * `/models` *typeorm entities*
    * `/repositories` *custom typeorm repositories*
    * `/services` *bulk of game logic*
  * `/config` *api configuration*
  * `/migration` *typeorm migration objects*
  * `/seed` *typeorm seed objects*
  * `/subscriber` *typeorm subscriber objects*
  * `/tests` *all test*
  * `/utils` *utilitiy scripts*
* `/types` *custom type definitions*

### logic separation

Method call flow:

`Request -> Controller -> Service -> Factory -> [Repository] -> [Model]`

#### Controllers
- are strictly responsible for receiving and parsing requests, passing
  the data off to appropriate services, and parsing and returning data
  back in the response.
- req/res should be processed here, and not passed directly to services
- should not deal directly with factories and repositories

#### Services
- encapsulate the vast bulk of the game logic
- responsible for all error logging
- need to know nothing about the request or response

#### Factories
- should be used for creating/building entities, as well as mock
  data for tests.
- NOTE: Currently, repositories need to be built from an instantiated
  factory.  This is not ideal, and should be refactored at some point.

#### Repositories
- should contain all database logic for retrieval of records,
  associations, etc.
  
#### Models
- should contain entity definitions only
- no logic of any kind

### error handling

Error flow:

`Model -> Repository -> Factory -> Service -> Controller -> Response`

- Models should catch any errors and rethrow
- Repositories should catch any errors and rethrow
- Factories should catch any errors and rethrow
- Services should log as much detail as necessary to the console and rethrow
- Controllers should package the error into a 500 response to the client.

Service methods are generally the only ones that should be logging to the console.  Others will just bubble up the errors to the service.  Services will rethrow the errors back to the controller so that the controller can handle what details to present to the client in a 500 response.

## API Testing

API test procedure has been implemented in Postman