# Product Overview

Openworld API is a backend REST API for a role-playing game system built with NestJS. The API manages:

- Player authentication and authorization
- Game sessions with multiple players
- Character creation and management with races, skills, and attributes
- Turn-based battle system with monsters and combat mechanics
- Inventory system including weapons, armor, jewelry, and spellbooks
- Map/tile data for game world
- Conditions and status effects
- Damage types and slayer mechanics

## Architecture

The system supports multiple concurrent games, each with their own players, characters, and battles. Players can own games, invite other players, create characters, and engage in battles with monsters.

### Communication Patterns

- **HTTP/REST** - Used for data requests where the client needs a response (AJAX)
  - Player login and authentication
  - Creating/joining games
  - Creating/entering battles
  - All data retrieval operations

- **WebSockets** (planned) - Used for real-time updates where client doesn't need to wait for response
  - Socket namespaces created per game (identified by game ID)
  - Socket rooms created per battle (identified by battle ID)
  - Player join/leave notifications
  - Real-time game state updates

### Authentication Flow

1. Player logs in via HTTP endpoint
2. Server returns playerId and JWT token
3. Client stores token and includes it in:
   - Authorization header for HTTP requests
   - "token" property in socket messages (when implemented)
