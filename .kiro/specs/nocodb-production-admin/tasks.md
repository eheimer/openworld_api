# Implementation Plan

- [x] 1. Create Docker Compose configuration for NocoDB
  - Create `deployment/docker-compose.nocodb.yml` file
  - Configure NocoDB container with nocodb/nocodb:latest image
  - Set port binding to 127.0.0.1:8080:8080 (localhost only)
  - Configure environment variables: NC_DB, NC_PUBLIC_URL, NC_DISABLE_TELE
  - Set up named volume `nocodb_data` for persistence
  - Set restart policy to `unless-stopped`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3_

- [x] 2. Create systemd service for NocoDB container management
  - Create systemd service file template at `deployment/nocodb.service`
  - Configure service to run docker-compose command
  - Set service dependencies (docker.service)
  - Configure restart policy (on-failure)
  - Add service enable/disable commands
  - _Requirements: 2.5_

- [x] 3. Update Apache configuration for /admin reverse proxy
  - Update `deployment/apache-openworld.conf` file
  - Add ProxyPass rules for /admin path before catch-all rules
  - Configure WebSocket support for NocoDB
  - Preserve existing main app proxy configuration
  - Ensure security headers apply to /admin path
  - _Requirements: 1.2, 1.3, 1.4, 5.5_

- [x] 4. Create database migration for admin user
  - Generate new DML migration file: `migration/DML/{timestamp}-create-admin-user.ts`
  - Implement up() method to create admin user with username 'owadmin'
  - Generate password: two memorable words separated by underscore
  - Hash password using bcrypt with existing salt rounds
  - Add idempotency check (verify user doesn't already exist)
  - Implement down() method to remove admin user
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Create deployment documentation
  - Create `deployment/NOCODB_DEPLOYMENT.md` file
  - Document Docker installation steps
  - Document systemd service installation and configuration
  - Document Apache configuration update steps
  - Document migration execution steps
  - Document NocoDB first-time setup (database connection via UI)
  - Include verification checklist
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 6. Create troubleshooting documentation
  - Add troubleshooting section to `deployment/NOCODB_DEPLOYMENT.md`
  - Document common issues: container startup failures, database connection errors
  - Document diagnostic commands for each issue
  - Document rollback procedures
  - Include log file locations
  - _Requirements: 6.5_

- [x] 7. Create maintenance documentation
  - Create `deployment/NOCODB_MAINTENANCE.md` file
  - Document start/stop/restart commands
  - Document update procedures for NocoDB
  - Document backup procedures for NocoDB metadata
  - Document health check commands
  - Include monitoring recommendations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 8. Create deployment verification script
  - Create `deployment/verify-nocodb.sh` script
  - Check Docker container status
  - Check systemd service status
  - Test localhost:8080 connectivity
  - Test HTTPS access to /admin endpoint
  - Verify database connection
  - Output clear pass/fail results
  - _Requirements: 1.1, 2.1, 4.1_
