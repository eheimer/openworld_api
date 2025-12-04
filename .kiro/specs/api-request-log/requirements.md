# Requirements Document

**GitHub Issue:** #33

## Introduction

The test client at `/client/` provides manual QA testing capabilities for the Openworld API. Currently, the API Request/Response Log component is not functioning properly - it fails to populate with request and response data. This feature will fix the logging functionality and add user-configurable behaviors for auto-scrolling and log entry management to improve the testing experience.

## Glossary

- **Test Client**: The Vue.js-based web application located at `/client-src/` that provides a UI for manually testing API endpoints
- **API Request/Response Log**: A UI component that displays a chronological list of HTTP requests sent to the API and their corresponding responses
- **Log Entry**: A single record in the log containing request details (method, URL, body) and response details (status, body, timestamp)
- **Auto-scroll**: Automatic scrolling behavior that moves the viewport to show newly added log entries
- **Auto-cull**: Automatic removal of old log entries when the log exceeds a maximum size

## Requirements

### Requirement 1

**User Story:** As a QA tester, I want the API Request/Response Log to capture and display all API interactions, so that I can review what requests were sent and what responses were received.

#### Acceptance Criteria

1. WHEN an API request is sent from the test client THEN the system SHALL record the request method, URL, and body in the log
2. WHEN an API response is received THEN the system SHALL record the response status code, body, and timestamp in the log
3. WHEN a log entry is created THEN the system SHALL display it in the API Request/Response Log component
4. WHEN multiple requests are made THEN the system SHALL display log entries in chronological order with newest entries at the bottom

### Requirement 2

**User Story:** As a QA tester, I want the log to automatically scroll to new entries, so that I can immediately see the results of my API calls without manual scrolling.

#### Acceptance Criteria

1. WHEN a new log entry is added THEN the system SHALL automatically scroll the log viewport to make the new entry visible
2. WHEN the "Auto-scroll to new entry" checkbox is checked THEN the system SHALL enable automatic scrolling behavior
3. WHEN the "Auto-scroll to new entry" checkbox is unchecked THEN the system SHALL disable automatic scrolling behavior
4. WHEN the test client initializes THEN the system SHALL set the "Auto-scroll to new entry" checkbox to checked by default

### Requirement 3

**User Story:** As a QA tester, I want to control whether the log automatically scrolls to new entries, so that I can review older log entries without being interrupted by new requests.

#### Acceptance Criteria

1. THE test client SHALL display an "Auto-scroll to new entry" checkbox near the top of the page
2. WHEN a user clicks the checkbox THEN the system SHALL toggle the auto-scroll behavior
3. WHEN auto-scroll is disabled and new entries are added THEN the system SHALL maintain the current scroll position

### Requirement 4

**User Story:** As a QA tester, I want the log to automatically remove old entries after reaching a limit, so that the log remains performant and doesn't consume excessive memory during long testing sessions.

#### Acceptance Criteria

1. WHEN the log contains more than 100 entries THEN the system SHALL remove the oldest entries to maintain a maximum of 100 entries
2. WHEN the "Auto-cull old log entries" checkbox is checked THEN the system SHALL enable automatic removal of old entries
3. WHEN the "Auto-cull old log entries" checkbox is unchecked THEN the system SHALL allow the log to grow beyond 100 entries
4. WHEN the test client initializes THEN the system SHALL set the "Auto-cull old log entries" checkbox to checked by default

### Requirement 5

**User Story:** As a QA tester, I want to control whether old log entries are automatically removed, so that I can preserve the complete history of a testing session when needed.

#### Acceptance Criteria

1. THE test client SHALL display an "Auto-cull old log entries" checkbox near the top of the page
2. WHEN a user clicks the checkbox THEN the system SHALL toggle the auto-cull behavior
3. WHEN auto-cull is disabled THEN the system SHALL retain all log entries regardless of count

### Requirement 6

**User Story:** As a QA tester, I want the log to be scrollable, so that I can review any entry in the log history.

#### Acceptance Criteria

1. WHEN the log contains more entries than can fit in the viewport THEN the system SHALL display a scrollbar
2. WHEN a user interacts with the scrollbar THEN the system SHALL allow navigation through all log entries
3. WHEN the log viewport is scrolled THEN the system SHALL maintain readability of all visible log entries
