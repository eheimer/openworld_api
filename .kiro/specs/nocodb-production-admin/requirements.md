# Requirements Document

**GitHub Issue:** #26

## Introduction

This feature implements NocoDB as a production database administration interface for non-technical admin users. NocoDB provides a spreadsheet-like interface for managing game data in the MySQL production database. The admin interface will be accessible at https://openworld.heimerman.org/admin and will include a secure admin user account for database management.

## Glossary

- **NocoDB**: An open-source no-code database platform that provides a spreadsheet-like interface for database management
- **Admin Interface**: The web-based NocoDB interface accessible to authorized administrators
- **Production Server**: The live server hosting the Openworld API at openworld.heimerman.org
- **Apache Reverse Proxy**: The web server that routes requests from /admin to the NocoDB service
- **Admin User**: A database user account with credentials for accessing the admin interface
- **Migration Script**: A database migration that creates the initial admin user account
- **Docker Container**: An isolated environment running the NocoDB service
- **PM2**: The process manager currently managing the Node.js application
- **SSL Certificate**: The Let's Encrypt certificate providing HTTPS encryption

## Requirements

### Requirement 1

**User Story:** As a non-technical administrator, I want to access a web-based database admin interface at https://openworld.heimerman.org/admin, so that I can manage game data without using SQL commands or technical tools.

#### Acceptance Criteria

1. WHEN an administrator navigates to https://openworld.heimerman.org/admin, THE Admin Interface SHALL display the NocoDB login page with HTTPS encryption
2. WHEN the URL path is /admin or /admin/*, THE Apache Reverse Proxy SHALL forward requests to the NocoDB Docker Container on port 8080
3. THE Apache Reverse Proxy SHALL preserve the original request headers including host, protocol, and client IP address
4. THE Admin Interface SHALL be accessible only via HTTPS with valid SSL Certificate
5. WHEN NocoDB is not running, THE Apache Reverse Proxy SHALL return a 502 Bad Gateway error with a meaningful error message

### Requirement 2

**User Story:** As a system administrator, I want NocoDB to run as a Docker container managed by systemd, so that the admin interface automatically starts on system boot and restarts on failure.

#### Acceptance Criteria

1. THE NocoDB Docker Container SHALL run with the image nocodb/nocodb:latest
2. THE NocoDB Docker Container SHALL expose port 8080 internally and bind to localhost:8080 on the host
3. THE NocoDB Docker Container SHALL persist its configuration data in a named Docker volume
4. THE NocoDB Docker Container SHALL restart automatically when the container stops unexpectedly
5. WHEN the production server reboots, THE NocoDB Docker Container SHALL start automatically via systemd service

### Requirement 3

**User Story:** As a system administrator, I want to create an admin user account during deployment, so that authorized personnel can log in to manage game data immediately after setup.

#### Acceptance Criteria

1. THE Migration Script SHALL create a new player record with username 'owadmin'
2. THE Migration Script SHALL set the password to two short memorable words separated by an underscore
3. THE Migration Script SHALL hash the password using the same bcrypt algorithm as the authentication system
4. THE Migration Script SHALL be idempotent and not fail when the admin user already exists
5. THE Admin User SHALL be able to authenticate via the existing /auth/login endpoint

### Requirement 4

**User Story:** As a non-technical administrator, I want NocoDB to connect to the production MySQL database, so that I can view and edit all game tables including monsters, items, conditions, and player data.

#### Acceptance Criteria

1. THE NocoDB Docker Container SHALL connect to the MySQL database on localhost port 3306
2. THE NocoDB Docker Container SHALL use the existing 'openworld' database credentials
3. WHEN NocoDB connects to the database, THE Admin Interface SHALL display all existing tables as spreadsheet views
4. THE Admin Interface SHALL detect and display foreign key relationships between tables
5. THE Admin Interface SHALL allow administrators to view, create, update, and delete records in all tables

### Requirement 5

**User Story:** As a system administrator, I want to configure NocoDB with appropriate security settings, so that the admin interface is protected from unauthorized access and data breaches.

#### Acceptance Criteria

1. THE NocoDB Docker Container SHALL disable telemetry data collection
2. THE NocoDB Docker Container SHALL set the public URL to https://openworld.heimerman.org/admin
3. THE NocoDB Docker Container SHALL store its own metadata in a SQLite database within the persistent volume
4. THE NocoDB Docker Container SHALL run with minimal required permissions
5. THE Apache Reverse Proxy SHALL not expose the internal NocoDB port 8080 to external networks

### Requirement 6

**User Story:** As a system administrator, I want deployment documentation and scripts, so that I can deploy, maintain, and troubleshoot the NocoDB admin interface in production.

#### Acceptance Criteria

1. THE Deployment Documentation SHALL include step-by-step instructions for installing Docker and Docker Compose
2. THE Deployment Documentation SHALL include instructions for creating the systemd service for NocoDB
3. THE Deployment Documentation SHALL include instructions for configuring the Apache reverse proxy
4. THE Deployment Documentation SHALL include commands for starting, stopping, and restarting NocoDB
5. THE Deployment Documentation SHALL include troubleshooting steps for common issues including connection failures and permission errors
