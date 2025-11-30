# Requirements Document

## Introduction

This feature provides simple API tests using the REST Client extension to verify that the Openworld API server is responding correctly to basic HTTP requests. These tests serve as quick smoke tests to validate server health and basic endpoint functionality.

## Glossary

- **REST Client**: VS Code extension by Humao that allows sending HTTP requests from `.http` files
- **API Server**: The NestJS-based Openworld API backend application
- **Smoke Test**: Basic tests that verify core functionality is working
- **Endpoint**: A specific URL path that handles HTTP requests in the API

## Requirements

### Requirement 1

**User Story:** As a developer, I want to quickly verify the API server is running and responding, so that I can confirm the application started successfully

#### Acceptance Criteria

1. WHEN the developer opens a REST Client file, THE REST Client SHALL provide executable HTTP requests for health checks
2. THE REST Client file SHALL include requests to verify server availability at the root endpoint
3. WHEN a request is executed, THE REST Client SHALL display the response status and body inline
4. THE REST Client file SHALL be organized with clear comments separating different test sections

### Requirement 2

**User Story:** As a developer, I want to test authentication endpoints, so that I can verify login functionality works correctly

#### Acceptance Criteria

1. THE REST Client file SHALL include a request to create a test player account
2. THE REST Client file SHALL include a request to authenticate with valid credentials
3. WHEN authentication succeeds, THE API Server SHALL return a JWT token in the response
4. THE REST Client file SHALL capture the JWT token for use in subsequent authenticated requests
5. THE REST Client file SHALL include examples of both successful and failed authentication attempts

### Requirement 3

**User Story:** As a developer, I want to test basic CRUD operations on core resources, so that I can verify the main API functionality is working

#### Acceptance Criteria

1. THE REST Client file SHALL include authenticated requests to create game resources
2. THE REST Client file SHALL include requests to retrieve resource lists
3. THE REST Client file SHALL include requests to retrieve individual resources by ID
4. THE REST Client file SHALL use captured authentication tokens in protected endpoint requests
5. THE REST Client file SHALL test at least three core resource types (games, characters, players)

### Requirement 4

**User Story:** As a developer, I want the test file to be reusable and maintainable, so that I can run tests repeatedly without manual cleanup

#### Acceptance Criteria

1. THE REST Client file SHALL use variables for the base URL to support different environments
2. THE REST Client file SHALL use variables to capture and reuse resource IDs from responses
3. THE REST Client file SHALL include comments explaining the purpose of each request
4. THE REST Client file SHALL be located in a discoverable location within the test directory structure
5. WHERE the server is reseeded, THE REST Client file SHALL work without modification
