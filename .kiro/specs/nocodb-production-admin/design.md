# Design Document

## Overview

This design implements NocoDB as a production database administration interface accessible at https://openworld.heimerman.org/admin. The solution uses Docker for NocoDB deployment, systemd for container lifecycle management, and Apache reverse proxy for HTTPS access. An admin user account will be created via database migration to provide immediate access after deployment.

## Architecture

### High-Level Architecture

```
Internet (HTTPS)
    ↓
Apache Web Server (Port 443)
    ↓ (Reverse Proxy /admin/*)
Docker Container (NocoDB on localhost:8080)
    ↓
MySQL Database (localhost:3306)
```

### Component Interaction Flow

1. **User Access**: Admin navigates to https://openworld.heimerman.org/admin
2. **SSL Termination**: Apache handles HTTPS with Let's Encrypt certificate
3. **Reverse Proxy**: Apache forwards requests to NocoDB container on localhost:8080
4. **Authentication**: NocoDB authenticates user with its own user system
5. **Database Connection**: NocoDB connects to MySQL using existing credentials
6. **Data Management**: Admin edits game data through NocoDB's spreadsheet interface

### Deployment Model

- **NocoDB**: Runs in Docker container managed by systemd
- **Main Application**: Continues running via PM2 (unchanged)
- **Apache**: Serves both main app and NocoDB admin interface
- **MySQL**: Shared by both main app and NocoDB (read/write access)

## Components and Interfaces

### 1. Docker Container Configuration

**Purpose**: Run NocoDB in an isolated, reproducible environment

**Configuration File**: `deployment/docker-compose.nocodb.yml`

**Key Settings**:
- Image: `nocodb/nocodb:latest`
- Port Binding: `127.0.0.1:8080:8080` (localhost only, not exposed externally)
- Volume: Named volume `nocodb_data` for persistence
- Environment Variables:
  - `NC_DB`: SQLite for NocoDB's metadata (user accounts, settings)
  - `NC_PUBLIC_URL`: https://openworld.heimerman.org/admin
  - `NC_DISABLE_TELE`: true (disable telemetry)
- Restart Policy: `unless-stopped`

**Network Isolation**: Container binds to localhost only; external access via Apache reverse proxy

### 2. Systemd Service

**Purpose**: Manage Docker container lifecycle (auto-start on boot, restart on failure)

**Service File**: `/etc/systemd/system/nocodb.service`

**Key Features**:
- Starts Docker Compose on system boot
- Restarts container on failure
- Stops gracefully on shutdown
- Logs to systemd journal

**Commands**:
```bash
systemctl start nocodb    # Start NocoDB
systemctl stop nocodb     # Stop NocoDB
systemctl status nocodb   # Check status
systemctl enable nocodb   # Enable auto-start
```

### 3. Apache Reverse Proxy Configuration

**Purpose**: Route /admin requests to NocoDB with HTTPS

**Configuration File**: `/etc/apache2/sites-available/openworld.conf` (update existing)

**Proxy Rules**:
```apache
<VirtualHost *:443>
    ServerName openworld.heimerman.org
    
    # Enable proxy modules
    ProxyPreserveHost On
    ProxyRequests Off
    
    # New NocoDB admin proxy (MUST come before catch-all / proxy)
    ProxyPass /admin http://localhost:8080/admin
    ProxyPassReverse /admin http://localhost:8080/admin
    
    # WebSocket support
    RewriteEngine On
    
    # WebSocket for NocoDB admin
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteCond %{REQUEST_URI} ^/admin [NC]
    RewriteRule /admin/(.*)     ws://localhost:8080/admin/$1 [P,L]
    
    # WebSocket for main app (existing)
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*)           ws://localhost:3000/$1 [P,L]
    
    # HTTP proxy for main app (existing catch-all)
    RewriteCond %{HTTP:Upgrade} !=websocket [NC]
    RewriteRule /(.*)           http://localhost:3000/$1 [P,L]
    
    # Existing security headers (unchanged)
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

**Important Notes**:
- The `/admin` ProxyPass directives must appear BEFORE the catch-all rewrite rules
- The existing catch-all proxy (`/` → `http://localhost:3000/`) is replaced with RewriteRule to allow conditional routing
- All existing functionality for the main app remains unchanged
- Security headers apply to both main app and admin interface

### 4. Database Migration for Admin User

**Purpose**: Create initial admin user account for authentication

**Migration File**: `migration/DML/{timestamp}-create-admin-user.ts`

**Implementation Details**:
- Username: `owadmin`
- Password: Two memorable words separated by underscore (e.g., `forest_dragon`)
- Password Hashing: Use bcrypt with same salt rounds as existing auth system
- Idempotency: Check if user exists before creating (safe to run multiple times)

**Migration Structure**:
```typescript
export class CreateAdminUser implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if admin user exists
    // If not, create with hashed password
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove admin user
  }
}
```

### 5. NocoDB Database Connection

**Purpose**: Connect NocoDB to production MySQL database

**Connection Method**: Manual configuration via NocoDB UI (first-time setup)

**Connection Parameters**:
- Database Type: MySQL
- Host: localhost
- Port: 3306
- Database: openworld
- Username: openworld (existing user)
- Password: (from production .env.prod)

**Data Access**: NocoDB will have full read/write access to all tables

## Data Models

### NocoDB Metadata Storage

**Storage**: SQLite database within Docker volume (`nocodb_data`)

**Contains**:
- NocoDB user accounts (separate from application players)
- Project configurations
- View definitions (custom filters, sorts)
- User permissions and roles
- Audit logs

**Note**: This is separate from the application's MySQL database

### Application Database Access

**Tables Exposed to NocoDB**:
- All existing tables (players, games, characters, monsters, items, etc.)
- Foreign key relationships automatically detected
- Many-to-many relationships via junction tables

**Data Integrity**: NocoDB respects database constraints (foreign keys, unique constraints, not null)

## Error Handling

### Container Startup Failures

**Scenario**: Docker container fails to start

**Detection**: systemd service status shows failed state

**Handling**:
- systemd automatically attempts restart (configured in service file)
- Logs available via `journalctl -u nocodb`
- Manual intervention required if persistent failure

**Common Causes**:
- Port 8080 already in use
- Docker daemon not running
- Volume permission issues

### Database Connection Failures

**Scenario**: NocoDB cannot connect to MySQL

**Detection**: NocoDB UI shows connection error

**Handling**:
- Verify MySQL is running: `systemctl status mysql`
- Test credentials: `mysql -u openworld -p`
- Check firewall rules (should allow localhost connections)
- Review NocoDB logs: `docker logs openworld-nocodb`

### Apache Proxy Failures

**Scenario**: 502 Bad Gateway when accessing /admin

**Detection**: Apache error logs show proxy connection refused

**Handling**:
- Verify NocoDB container is running: `docker ps`
- Test direct access: `curl http://localhost:8080`
- Check Apache configuration: `apache2ctl configtest`
- Review Apache logs: `/var/log/apache2/openworld-ssl-error.log`

### SSL Certificate Issues

**Scenario**: Certificate expired or invalid

**Detection**: Browser shows SSL warning

**Handling**:
- Check certificate status: `certbot certificates`
- Renew if needed: `certbot renew`
- Restart Apache: `systemctl reload apache2`

## Testing Strategy

### Pre-Deployment Testing

**Local Development Testing**:
1. Test Docker Compose configuration locally
2. Verify NocoDB starts and connects to dev.sqlite
3. Test Apache proxy configuration with local Apache
4. Verify admin user migration runs successfully

**Integration Testing**:
1. Test full stack: Apache → NocoDB → MySQL
2. Verify HTTPS access works correctly
3. Test admin user login
4. Verify database operations (CRUD) through NocoDB

### Post-Deployment Verification

**Deployment Checklist**:
1. ✓ Docker container running: `docker ps | grep nocodb`
2. ✓ Systemd service active: `systemctl status nocodb`
3. ✓ NocoDB accessible locally: `curl http://localhost:8080`
4. ✓ HTTPS access works: `curl https://openworld.heimerman.org/admin`
5. ✓ Admin user can login
6. ✓ Database connection successful
7. ✓ Tables visible in NocoDB
8. ✓ Can create/edit/delete records

**Functional Testing**:
1. Login with admin user credentials
2. Connect to MySQL database via NocoDB UI
3. Verify all tables are visible
4. Test CRUD operations on a non-critical table
5. Verify foreign key relationships display correctly
6. Test custom view creation
7. Verify audit log captures changes

### Rollback Plan

**If Deployment Fails**:
1. Stop NocoDB: `systemctl stop nocodb`
2. Disable systemd service: `systemctl disable nocodb`
3. Remove Apache proxy configuration (comment out /admin section)
4. Reload Apache: `systemctl reload apache2`
5. Remove Docker container: `docker-compose -f deployment/docker-compose.nocodb.yml down`

**Database Rollback**:
- Revert admin user migration: `npm run migration:revert`
- No schema changes, so minimal risk

## Security Considerations

### Network Security

**Port Exposure**:
- NocoDB port 8080 bound to localhost only (not exposed to internet)
- External access only via Apache reverse proxy with HTTPS
- No direct database access from internet

**Firewall Rules**: No changes needed (port 8080 not exposed)

### Authentication & Authorization

**NocoDB User Management**:
- Separate from application player accounts
- NocoDB has its own user system
- Admin creates NocoDB users via UI
- Recommended: Use "Editor" role for non-technical admins

**Database Credentials**:
- NocoDB uses existing MySQL credentials (from .env.prod)
- No new database users required
- Full read/write access to openworld database

### Data Protection

**Backup Strategy**:
- Existing database backups cover data edited via NocoDB
- NocoDB metadata backed up via Docker volume backup
- Backup command: `docker run --rm -v nocodb_data:/data -v $(pwd):/backup alpine tar czf /backup/nocodb_data_backup.tar.gz -C /data .`

**Audit Trail**:
- NocoDB maintains audit log of all changes
- Accessible via NocoDB UI (Settings → Audit)
- Shows who changed what and when

### SSL/TLS

**Certificate Management**:
- Existing Let's Encrypt certificate covers /admin path
- No additional certificate configuration needed
- Auto-renewal continues to work

## Deployment Steps Summary

1. **Install Docker** (if not present)
2. **Create Docker Compose file** for NocoDB
3. **Create systemd service** for container management
4. **Update Apache configuration** to add /admin proxy
5. **Create and run admin user migration**
6. **Start NocoDB** via systemd
7. **Configure NocoDB** (first-time setup via UI)
8. **Verify deployment** using checklist

## Maintenance and Operations

### Regular Maintenance

**Weekly**:
- Check NocoDB container status: `docker ps`
- Review NocoDB logs for errors: `docker logs openworld-nocodb --tail 100`

**Monthly**:
- Update NocoDB image: `docker pull nocodb/nocodb:latest && systemctl restart nocodb`
- Backup NocoDB metadata volume
- Review audit logs for suspicious activity

### Monitoring

**Health Checks**:
- Container status: `systemctl status nocodb`
- Application health: `curl http://localhost:8080/api/v1/health`
- Apache proxy: `curl -I https://openworld.heimerman.org/admin`

**Log Locations**:
- NocoDB logs: `docker logs openworld-nocodb`
- Systemd logs: `journalctl -u nocodb`
- Apache logs: `/var/log/apache2/openworld-ssl-error.log`

### Troubleshooting Guide

**Common Issues**:

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| 502 Bad Gateway | NocoDB not running | `systemctl start nocodb` |
| Connection refused | Port 8080 in use | `netstat -tlnp \| grep 8080` |
| Database connection failed | MySQL not running | `systemctl start mysql` |
| SSL warning | Certificate expired | `certbot renew` |
| Container won't start | Docker daemon down | `systemctl start docker` |

## Documentation Deliverables

1. **Deployment Guide**: Step-by-step production deployment instructions
2. **User Guide**: How to use NocoDB for game data management
3. **Troubleshooting Guide**: Common issues and solutions
4. **Maintenance Procedures**: Regular maintenance tasks

## Future Enhancements

**Potential Improvements**:
- Read-only database user for safer viewing
- Custom NocoDB views for common admin tasks
- Automated backup script for NocoDB metadata
- Integration with application's authentication system (SSO)
- Custom branding (logo, colors) for NocoDB interface
