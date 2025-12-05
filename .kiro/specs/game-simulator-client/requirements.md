# Requirements Document

## Introduction

This specification defines the transformation of the test client into a game simulator with state-driven navigation, improved UI layout, and automatic screen selection based on application state. The system will provide a more immersive game experience by managing player, game, character, and battle state, and automatically displaying appropriate screens based on the current state.

## Glossary

- **Test Client**: The Vue.js-based web application used for testing and interacting with the Openworld API
- **Game Simulator**: The enhanced test client that provides a game-like experience with state management
- **Application State**: An object containing player, game, character, and battle information that drives UI behavior
- **Hamburger Menu**: A collapsible navigation menu accessed via an icon in the top-left corner
- **API Log Panel**: A slide-out panel on the right side that displays API request/response logs
- **Screen**: A distinct view component displayed based on application state
- **Context-Sensitive Menu**: A navigation menu that displays different options based on current application state

## Requirements

### Requirement 1

**User Story:** As a user, I want a hamburger menu in the top-left corner, so that I can access navigation options without consuming screen real estate.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a hamburger menu icon in the top-left corner
2. WHEN a user clicks the hamburger menu icon THEN the system SHALL display a slide-out navigation menu
3. WHEN the navigation menu is open and a user clicks outside the menu THEN the system SHALL close the navigation menu
4. WHEN a user selects a menu option THEN the system SHALL close the navigation menu and execute the selected action

### Requirement 2

**User Story:** As a user, I want the API log in a slide-out panel on the right side, so that I can view request/response details without cluttering the main interface.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL hide the API log panel by default
2. WHEN a user clicks the API log toggle button THEN the system SHALL display the API log panel sliding in from the right side
3. WHEN the API log panel is open and a user clicks the toggle button THEN the system SHALL hide the API log panel
4. WHEN the API log panel is open THEN the system SHALL display all API request and response logs
5. WHEN the API log panel is hidden THEN the system SHALL preserve the main content area for game screens

### Requirement 3

**User Story:** As a user, I want the application to maintain state for player, game, character, and battle, so that the system can automatically display appropriate screens.

#### Acceptance Criteria

1. WHEN the application initializes THEN the system SHALL create a state object with player, game, character, and battle properties set to null
2. WHEN a user logs in THEN the system SHALL populate the player property in the state object
3. WHEN a user selects a game THEN the system SHALL populate the game property in the state object
4. WHEN a user creates or loads a character THEN the system SHALL populate the character property in the state object
5. WHEN a user enters a battle THEN the system SHALL populate the battle property in the state object
6. WHEN state changes occur THEN the system SHALL persist the state to browser local storage
7. WHEN the application loads THEN the system SHALL restore state from browser local storage if available

### Requirement 4

**User Story:** As a user, I want the application to automatically display the appropriate screen based on current state, so that I have a seamless navigation experience.

#### Acceptance Criteria

1. WHEN the player property is null THEN the system SHALL display the login screen
2. WHEN the player property is not null and the game property is null THEN the system SHALL display the game-select screen
3. WHEN the player property is not null and the game property is not null and the character property is null THEN the system SHALL display the character-create screen
4. WHEN the player property is not null and the game property is not null and the character property is not null and the battle property is null THEN the system SHALL display the character screen with a start battle button
5. WHEN all state properties are populated THEN the system SHALL display the battle screen

### Requirement 5

**User Story:** As a user, I want the game-select screen to provide game creation functionality, so that I can create new games without navigating through multiple screens.

#### Acceptance Criteria

1. WHEN the game-select screen is displayed THEN the system SHALL show a list of available games for the player
2. WHEN the game-select screen is displayed THEN the system SHALL display a create game button
3. WHEN a user clicks the create game button THEN the system SHALL display the game-create screen
4. WHEN a user successfully creates a game THEN the system SHALL populate the game property in state and navigate to the next appropriate screen

### Requirement 6

**User Story:** As a user, I want the system to automatically load my character when I select a game, so that I don't have to manually select my character each time.

#### Acceptance Criteria

1. WHEN a user selects a game THEN the system SHALL query the API for characters belonging to the player in that game
2. WHEN a character exists for the player in the selected game THEN the system SHALL populate the character property in state
3. WHEN no character exists for the player in the selected game THEN the system SHALL leave the character property as null and display the character-create screen
4. WHEN multiple characters exist for the player in the selected game THEN the system SHALL populate the character property with the first character

### Requirement 7

**User Story:** As a user, I want the login screen to provide registration functionality, so that I can create a new account without navigating away.

#### Acceptance Criteria

1. WHEN the login screen is displayed THEN the system SHALL display a register button
2. WHEN a user clicks the register button THEN the system SHALL display the registration screen
3. WHEN a user successfully registers THEN the system SHALL automatically log in the user with the provided credentials
4. WHEN automatic login succeeds after registration THEN the system SHALL populate the player property in state and navigate to the game-select screen

### Requirement 8

**User Story:** As a user, I want the hamburger menu to display context-sensitive options based on current state, so that I only see relevant navigation options.

#### Acceptance Criteria

1. WHEN all state properties are null THEN the system SHALL display only the login option in the hamburger menu
2. WHEN the player property is not null and other properties are null THEN the system SHALL display logout and select game options in the hamburger menu
3. WHEN the player and game properties are not null THEN the system SHALL display logout, select game, and select character options in the hamburger menu
4. WHEN the player, game, and character properties are not null THEN the system SHALL display logout, select game, select character, and leave battle options in the hamburger menu
5. WHEN a user selects logout from the menu THEN the system SHALL clear all state properties and display the login screen

### Requirement 9

**User Story:** As a user, I want all screens to automatically populate based on state, so that I don't have to repeatedly select the same information.

#### Acceptance Criteria

1. WHEN the battle screen is displayed THEN the system SHALL use the player, game, and character properties from state without requiring user selection
2. WHEN the character screen is displayed THEN the system SHALL use the player and game properties from state without requiring user selection
3. WHEN any screen makes an API request THEN the system SHALL use state properties to populate request parameters
4. WHEN state properties change THEN the system SHALL update all displayed screens to reflect the new state

### Requirement 10

**User Story:** As a user, I want the system to enforce single-battle-per-character constraint, so that I cannot enter multiple battles simultaneously.

#### Acceptance Criteria

1. WHEN a character is in a battle THEN the system SHALL prevent the character from entering another battle
2. WHEN a user attempts to create a battle while already in one THEN the system SHALL display an error message
3. WHEN a battle ends THEN the system SHALL clear the battle property from state
4. WHEN a user selects a game with a character in an active battle THEN the system SHALL automatically populate the battle property in state
