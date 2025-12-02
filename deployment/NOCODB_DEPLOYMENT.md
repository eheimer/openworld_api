# NocoDB Admin Interface Deployment Guide

This guide walks you through deploying NocoDB as a database administration interface for the Openworld API. NocoDB provides a spreadsheet-like interface for managing game data in the production MySQL database.

## Overview

**What you'll deploy:**
- NocoDB running in a Docker container
- Systemd service for automatic startup and management
- Apache reverse proxy configuration for HTTPS access at `/admin`
- Admin user account for initial login

**Access URL:** https://openworld.heimerman.org/admin

**Architecture:**
```
Internet (HTTPS) → Apache (Port 443) → NocoDB Container (localhost:8080) → MySQL (localhost:3306)
```

## Prerequisites

Before starting, ensure you have:

- ✓ Openworld API deployed and running (see `DEPLOYMENT_GUIDE.md`)
- ✓ MySQL database running with production data
- ✓ Apache web server configured with SSL
- ✓ Root or sudo access to the production server
- ✓ SSH access to openworld.heimerman.org

## Quick Reference

### Key File Locations

| File | Purpose |
|------|---------|
| `/var/www/openworld-api/deployment/docker-compose.nocodb.yml` | Docker Compose configuration |
| `/etc/systemd/system/nocodb.service` | Systemd service definition |
| `/etc/apache2/sites-available/openworld.conf` | Apache configuration (updated) |
| `/var/lib/docker/volumes/nocodb_data/` | NocoDB persistent data |

### Key Commands

```bash
# Service management
sudo systemctl start nocodb
sudo systemctl stop nocodb
sudo systemctl status nocodb
sudo systemctl restart nocodb

# View logs
sudo journalctl -u nocodb -f
docker logs openworld-nocodb

# Container management
docker ps | grep nocodb
docker-compose -f deployment/docker-compose.nocodb.yml ps
```

## Step 1: Install Docker

NocoDB runs in a Docker container. If Docker is not already installed:

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Verify installation
docker --version
```

### Install Docker Compose

```bash
# Install Docker Compose plugin
sudo apt-get install -y docker-compose-plugin

# Verify installation
docker compose version

# If the plugin isn't available, install standalone Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### Add User to Docker Group (Optional)

This allows running Docker commands without sudo:

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Log out and back in for changes to take effect
# Or run: newgrp docker
```

**Note:** For production, it's safer to use sudo with Docker commands.

## Step 2: Verify Docker Compose Configuration

The Docker Compose file should already exist in your deployment. Verify it:

```bash
cd /var/www/openworld-api/deployment
cat docker-compose.nocodb.yml
```

**Expected configuration:**

```yaml
version: '3.8'

services:
  nocodb:
    image: nocodb/nocodb:latest
    container_name: openworld-nocodb
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      NC_DB: "sqlite:///data/nocodb.db"
      NC_PUBLIC_URL: "https://openworld.heimerman.org/admin"
      NC_DISABLE_TELE: "true"
    volumes:
      - nocodb_data:/data
    restart: unless-stopped
    networks:
      - default

volumes:
  nocodb_data:
    name: nocodb_data

networks:
  default:
    driver: bridge
```

**Key settings explained:**
- `ports: "127.0.0.1:8080:8080"` - Binds to localhost only (not exposed to internet)
- `NC_DB` - Uses SQLite for NocoDB's own metadata (user accounts, settings)
- `NC_PUBLIC_URL` - Sets the public URL for proper redirects
- `NC_DISABLE_TELE` - Disables telemetry data collection
- `restart: unless-stopped` - Auto-restart on failure

## Step 3: Create Systemd Service

Create a systemd service to manage the NocoDB container lifecycle:

```bash
# Copy the service file
sudo cp /var/www/openworld-api/deployment/nocodb.service /etc/systemd/system/nocodb.service

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable nocodb
```

**Service file contents** (`/etc/systemd/system/nocodb.service`):

```ini
[Unit]
Description=NocoDB Admin Interface for Openworld API
Documentation=https://docs.nocodb.com/
After=network.target docker.service mysql.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/openworld-api/deployment
ExecStart=/usr/bin/docker-compose -f docker-compose.nocodb.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.nocodb.yml down
ExecReload=/usr/bin/docker-compose -f docker-compose.nocodb.yml restart
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Service features:**
- Starts automatically on system boot
- Restarts on failure (after 10 seconds)
- Waits for Docker and MySQL to be ready
- Logs to systemd journal

### Verify Service Configuration

```bash
# Check service status (should show "loaded" but not yet "active")
sudo systemctl status nocodb

# View service configuration
systemctl cat nocodb
```

## Step 4: Update Apache Configuration

Update the Apache configuration to add the reverse proxy for `/admin`:

### Backup Current Configuration

```bash
sudo cp /etc/apache2/sites-available/openworld.conf /etc/apache2/sites-available/openworld.conf.backup
```

### Verify Apache Configuration

The Apache configuration should already include the NocoDB proxy rules. Verify:

```bash
sudo cat /etc/apache2/sites-available/openworld.conf
```

**Required configuration in the `<VirtualHost *:443>` section:**

```apache
# Enable proxy modules
ProxyPreserveHost On
ProxyRequests Off

# NocoDB admin interface proxy (MUST come before catch-all rules)
ProxyPass /admin http://localhost:8080/admin
ProxyPassReverse /admin http://localhost:8080/admin

# WebSocket support
RewriteEngine On

# WebSocket for NocoDB admin
RewriteCond %{HTTP:Upgrade} =websocket [NC]
RewriteCond %{REQUEST_URI} ^/admin [NC]
RewriteRule /admin/(.*)     ws://localhost:8080/admin/$1 [P,L]

# WebSocket for main app
RewriteCond %{HTTP:Upgrade} =websocket [NC]
RewriteRule /(.*)           ws://localhost:3000/$1 [P,L]

# HTTP proxy for main app (catch-all)
RewriteCond %{HTTP:Upgrade} !=websocket [NC]
RewriteRule /(.*)           http://localhost:3000/$1 [P,L]
```

**Important:** The `/admin` ProxyPass directives must appear BEFORE the catch-all rewrite rules.

### Enable Required Apache Modules

```bash
# Enable proxy and rewrite modules (if not already enabled)
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel
sudo a2enmod rewrite
sudo a2enmod headers

# Test Apache configuration
sudo apache2ctl configtest
```

**Expected output:** `Syntax OK`

### Reload Apache

```bash
# Reload Apache to apply changes (no downtime)
sudo systemctl reload apache2

# Verify Apache is running
sudo systemctl status apache2
```

## Step 5: Create Admin User Account

Create an admin user account for logging into the Openworld API (used for NocoDB database connection):

```bash
cd /var/www/openworld-api

# Run the admin user migration
NODE_ENV=prod npm run migration:run
```

**What this does:**
- Creates a player account with username `owadmin`
- Sets a secure password (two memorable words separated by underscore)
- Uses bcrypt hashing (same as existing authentication system)
- Safe to run multiple times (idempotent)

**Admin credentials:**
- Username: `owadmin`
- Password: Check the migration file at `migration/DML/*-create-admin-user.ts` for the password

**Note:** You can log in with these credentials at https://openworld.heimerman.org/auth/login to verify the account works.

## Step 6: Start NocoDB Service

Start the NocoDB service:

```bash
# Start the service
sudo systemctl start nocodb

# Check status
sudo systemctl status nocodb
```

**Expected output:**
```
● nocodb.service - NocoDB Admin Interface for Openworld API
     Loaded: loaded (/etc/systemd/system/nocodb.service; enabled)
     Active: active (exited) since ...
```

### Verify Container is Running

```bash
# Check Docker container status
docker ps | grep nocodb
```

**Expected output:**
```
CONTAINER ID   IMAGE                    STATUS         PORTS                      NAMES
xxxxx          nocodb/nocodb:latest     Up X minutes   127.0.0.1:8080->8080/tcp   openworld-nocodb
```

### View Container Logs

```bash
# View NocoDB logs
docker logs openworld-nocodb

# Follow logs in real-time
docker logs -f openworld-nocodb
```

**Expected log output:**
```
NocoDB is ready on port 8080
```

## Step 7: Configure NocoDB (First-Time Setup)

Now configure NocoDB to connect to your MySQL database:

### Access NocoDB

1. Open your browser and navigate to: https://openworld.heimerman.org/admin
2. You should see the NocoDB welcome screen

### Create NocoDB Account

**Important:** This is a NocoDB user account (separate from the application's player accounts).

1. Click "Sign Up" or "Get Started"
2. Enter your email address
3. Create a strong password
4. Complete the registration

**Note:** The first user created becomes the NocoDB admin.

### Create a New Project

1. Click "Create New Project" or "New Project"
2. Enter a project name (e.g., "Openworld Database")
3. Click "Create"

### Connect to MySQL Database

1. In the project, click "Add New Base" or "New Base"
2. Select "MySQL" as the database type
3. Enter the connection details:

   ```
   Host: localhost
   Port: 3306
   Database: openworld
   Username: openworld
   Password: [from /var/www/openworld-api/.env.prod]
   ```

4. Click "Test Database Connection"
5. If successful, click "Submit" or "Connect"

**Where to find the database password:**
```bash
# View the database password (without exposing other secrets)
grep "^DB_PASSWORD" /var/www/openworld-api/.env.prod
```

### Verify Database Connection

After connecting, you should see:
- All database tables listed in the left sidebar
- Tables organized by schema
- Foreign key relationships automatically detected

**Expected tables:**
- players
- games
- characters
- monsters
- items (armor, weapons, jewelry, spellbooks)
- conditions
- damage_types
- skills
- races
- battles
- And more...

## Step 8: Verification Checklist

Run through this checklist to verify the deployment:

### Service Health Checks

```bash
# 1. Docker container is running
docker ps | grep nocodb
# Expected: Container with status "Up X minutes"

# 2. Systemd service is active
sudo systemctl status nocodb
# Expected: "active (exited)"

# 3. NocoDB is listening on port 8080
curl -I http://localhost:8080
# Expected: HTTP 200 or 302 response

# 4. HTTPS access works
curl -I https://openworld.heimerman.org/admin
# Expected: HTTP 200 or 302 response

# 5. Apache is running
sudo systemctl status apache2
# Expected: "active (running)"

# 6. MySQL is running
sudo systemctl status mysql
# Expected: "active (running)"
```

### Functional Verification

- [ ] Can access https://openworld.heimerman.org/admin
- [ ] NocoDB login page loads with HTTPS (green padlock)
- [ ] Can log in with NocoDB account
- [ ] Can connect to MySQL database via NocoDB UI
- [ ] All tables are visible in NocoDB
- [ ] Can view records in tables
- [ ] Can create a test record (use a non-critical table)
- [ ] Can edit a test record
- [ ] Can delete a test record
- [ ] Foreign key relationships display correctly
- [ ] Main application still works at https://openworld.heimerman.org

### Security Verification

```bash
# 1. Port 8080 is NOT exposed to internet (should show nothing)
sudo netstat -tlnp | grep 8080
# Expected: Only shows 127.0.0.1:8080 (localhost)

# 2. Environment file has correct permissions
ls -la /var/www/openworld-api/.env.prod
# Expected: -rw------- (600 permissions)

# 3. SSL certificate is valid
curl -I https://openworld.heimerman.org/admin 2>&1 | grep -i "ssl\|certificate"
# Expected: No SSL errors

# 4. Security headers are present
curl -I https://openworld.heimerman.org/admin | grep -i "x-frame\|x-content\|x-xss"
# Expected: Shows security headers
```

## Troubleshooting

This section provides detailed diagnostic procedures for common issues. Each issue includes symptoms, diagnostic commands, root cause analysis, and step-by-step solutions.

### Log File Locations

Before troubleshooting, familiarize yourself with log locations:

| Log Type | Location | Command |
|----------|----------|---------|
| NocoDB Container | Docker logs | `docker logs openworld-nocodb` |
| Systemd Service | Journal | `sudo journalctl -u nocodb` |
| Apache Access | `/var/log/apache2/openworld-ssl-access.log` | `sudo tail -f /var/log/apache2/openworld-ssl-access.log` |
| Apache Error | `/var/log/apache2/openworld-ssl-error.log` | `sudo tail -f /var/log/apache2/openworld-ssl-error.log` |
| MySQL Error | `/var/log/mysql/error.log` | `sudo tail -f /var/log/mysql/error.log` |
| Docker Daemon | Journal | `sudo journalctl -u docker` |

### Container Won't Start

**Symptoms:**
- `systemctl status nocodb` shows "failed" or "inactive (dead)"
- `docker ps` doesn't show the openworld-nocodb container
- Accessing `/admin` returns "502 Bad Gateway"

**Diagnostic Commands:**
```bash
# 1. Check systemd service status
sudo systemctl status nocodb

# 2. View recent systemd logs
sudo journalctl -u nocodb -n 50 --no-pager

# 3. Check if Docker daemon is running
sudo systemctl status docker

# 4. Try to view container logs (may fail if container never started)
docker logs openworld-nocodb 2>&1

# 5. Check if port 8080 is already in use
sudo netstat -tlnp | grep 8080
sudo lsof -i :8080

# 6. Validate Docker Compose configuration
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml config

# 7. Check Docker volume status
docker volume inspect nocodb_data

# 8. Check available disk space
df -h /var/lib/docker
```

**Common Causes and Solutions:**

#### Cause 1: Port 8080 Already in Use

**Diagnosis:**
```bash
sudo netstat -tlnp | grep 8080
# Shows another process using port 8080
```

**Solution:**
```bash
# Identify the conflicting process
sudo lsof -i :8080

# Option A: Stop the conflicting process
sudo kill <PID>

# Option B: Change NocoDB port in docker-compose.nocodb.yml
# Edit: ports: "127.0.0.1:8081:8080"
# Then update Apache proxy to use 8081
```

#### Cause 2: Docker Daemon Not Running

**Diagnosis:**
```bash
sudo systemctl status docker
# Shows "inactive (dead)" or "failed"
```

**Solution:**
```bash
# Start Docker daemon
sudo systemctl start docker

# Verify Docker is running
sudo systemctl status docker

# Start NocoDB
sudo systemctl start nocodb
```

#### Cause 3: Volume Permission Issues

**Diagnosis:**
```bash
docker logs openworld-nocodb 2>&1 | grep -i "permission denied"
# Shows permission errors
```

**Solution:**
```bash
# Check volume permissions
docker volume inspect nocodb_data

# Remove and recreate volume (WARNING: Deletes NocoDB data)
sudo systemctl stop nocodb
docker volume rm nocodb_data
docker volume create nocodb_data
sudo systemctl start nocodb
```

#### Cause 4: Invalid Docker Compose Configuration

**Diagnosis:**
```bash
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml config
# Shows YAML syntax errors
```

**Solution:**
```bash
# Fix syntax errors in docker-compose.nocodb.yml
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml

# Validate after fixing
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml config

# Restart service
sudo systemctl restart nocodb
```

#### Cause 5: Out of Disk Space

**Diagnosis:**
```bash
df -h /var/lib/docker
# Shows 100% usage
```

**Solution:**
```bash
# Clean up Docker resources
docker system prune -a --volumes

# Remove old images
docker image prune -a

# Check space again
df -h /var/lib/docker

# Restart NocoDB
sudo systemctl start nocodb
```

### 502 Bad Gateway

**Symptoms:**
- Accessing https://openworld.heimerman.org/admin shows "502 Bad Gateway"
- Apache error logs show "Connection refused" or "proxy: HTTP: attempt to connect to 127.0.0.1:8080 failed"
- Main application at `/` works fine

**Diagnostic Commands:**
```bash
# 1. Check if NocoDB container is running
docker ps | grep nocodb

# 2. Check container status details
docker ps -a | grep nocodb

# 3. Test direct access to NocoDB
curl -I http://localhost:8080

# 4. Check Apache error logs
sudo tail -n 50 /var/log/apache2/openworld-ssl-error.log

# 5. Check if port 8080 is listening
sudo netstat -tlnp | grep 8080

# 6. Verify Apache proxy configuration
sudo apache2ctl -t -D DUMP_VHOSTS | grep -A 10 openworld

# 7. Check systemd service status
sudo systemctl status nocodb

# 8. View NocoDB container logs
docker logs openworld-nocodb --tail 50
```

**Common Causes and Solutions:**

#### Cause 1: Container Not Running

**Diagnosis:**
```bash
docker ps | grep nocodb
# Shows nothing (container not running)

docker ps -a | grep nocodb
# Shows container with "Exited" status
```

**Solution:**
```bash
# Check why container stopped
docker logs openworld-nocodb

# Start the service
sudo systemctl start nocodb

# Verify container is running
docker ps | grep nocodb

# Test access
curl -I http://localhost:8080
```

#### Cause 2: Container Running But Not Responding

**Diagnosis:**
```bash
docker ps | grep nocodb
# Shows container is "Up"

curl -I http://localhost:8080
# Hangs or times out
```

**Solution:**
```bash
# Check container logs for errors
docker logs openworld-nocodb --tail 100

# Check container resource usage
docker stats openworld-nocodb --no-stream

# Restart the container
sudo systemctl restart nocodb

# Wait 10 seconds for startup
sleep 10

# Test again
curl -I http://localhost:8080
```

#### Cause 3: Apache Proxy Misconfigured

**Diagnosis:**
```bash
sudo apache2ctl configtest
# Shows syntax errors

sudo apache2ctl -t -D DUMP_VHOSTS | grep -A 10 openworld
# Shows incorrect proxy configuration
```

**Solution:**
```bash
# Test Apache configuration
sudo apache2ctl configtest

# If errors, fix configuration
sudo nano /etc/apache2/sites-available/openworld.conf

# Verify ProxyPass directives are present and correct:
# ProxyPass /admin http://localhost:8080/admin
# ProxyPassReverse /admin http://localhost:8080/admin

# Test configuration again
sudo apache2ctl configtest

# Reload Apache (no downtime)
sudo systemctl reload apache2

# Test access
curl -I https://openworld.heimerman.org/admin
```

#### Cause 4: Apache Proxy Modules Not Enabled

**Diagnosis:**
```bash
apache2ctl -M | grep proxy
# Shows no proxy modules or missing proxy_http
```

**Solution:**
```bash
# Enable required modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel

# Restart Apache
sudo systemctl restart apache2

# Verify modules are loaded
apache2ctl -M | grep proxy

# Test access
curl -I https://openworld.heimerman.org/admin
```

#### Cause 5: Firewall Blocking Localhost Communication

**Diagnosis:**
```bash
# Test if localhost communication works
curl -v http://localhost:8080 2>&1 | grep -i "connection refused"
```

**Solution:**
```bash
# Check firewall rules
sudo iptables -L -n | grep 8080

# If blocked, allow localhost traffic (should not be necessary)
sudo iptables -I INPUT -i lo -j ACCEPT
sudo iptables -I OUTPUT -o lo -j ACCEPT

# Make rules persistent
sudo netfilter-persistent save

# Test again
curl -I http://localhost:8080
```

### Database Connection Failed

**Symptoms:**
- NocoDB UI shows "Connection failed" or "Unable to connect to database" when adding MySQL base
- Can't see database tables after connecting
- NocoDB shows "Database connection error" in logs

**Diagnostic Commands:**
```bash
# 1. Check MySQL service status
sudo systemctl status mysql

# 2. Test MySQL connection with application credentials
mysql -u openworld -p -h localhost openworld
# Enter password from .env.prod when prompted

# 3. Verify database credentials
grep "^DB_" /var/www/openworld-api/.env.prod

# 4. Check MySQL is listening on correct port
sudo netstat -tlnp | grep 3306

# 5. Check MySQL error logs
sudo tail -n 50 /var/log/mysql/error.log

# 6. Test connection from within NocoDB container
docker exec openworld-nocodb nc -zv localhost 3306

# 7. Check MySQL user permissions
mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user='openworld';"

# 8. Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'openworld';"
```

**Common Causes and Solutions:**

#### Cause 1: Wrong Database Credentials

**Diagnosis:**
```bash
# Try to connect with credentials from .env.prod
grep "^DB_" /var/www/openworld-api/.env.prod
mysql -u openworld -p -h localhost openworld
# If fails with "Access denied", credentials are wrong
```

**Solution:**
```bash
# Verify the correct password
cat /var/www/openworld-api/.env.prod | grep DB_PASSWORD

# Test connection with correct credentials
mysql -u openworld -p -h localhost openworld

# If successful, use these exact credentials in NocoDB UI
# Host: localhost
# Port: 3306
# Database: openworld
# Username: openworld
# Password: [from .env.prod]
```

#### Cause 2: MySQL Service Not Running

**Diagnosis:**
```bash
sudo systemctl status mysql
# Shows "inactive (dead)" or "failed"
```

**Solution:**
```bash
# Start MySQL service
sudo systemctl start mysql

# Verify it's running
sudo systemctl status mysql

# Enable auto-start on boot
sudo systemctl enable mysql

# Test connection
mysql -u openworld -p -h localhost openworld
```

#### Cause 3: MySQL Not Listening on Localhost

**Diagnosis:**
```bash
sudo netstat -tlnp | grep 3306
# Shows nothing or shows 0.0.0.0:3306 instead of 127.0.0.1:3306
```

**Solution:**
```bash
# Check MySQL bind address
sudo grep "bind-address" /etc/mysql/mysql.conf.d/mysqld.cnf

# Should be: bind-address = 127.0.0.1
# If different, edit the file
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Restart MySQL
sudo systemctl restart mysql

# Verify it's listening
sudo netstat -tlnp | grep 3306
```

#### Cause 4: Database User Lacks Permissions

**Diagnosis:**
```bash
# Check user permissions
mysql -u root -p -e "SHOW GRANTS FOR 'openworld'@'localhost';"
# Should show GRANT ALL PRIVILEGES ON openworld.*
```

**Solution:**
```bash
# Grant necessary permissions
mysql -u root -p

# In MySQL prompt:
GRANT ALL PRIVILEGES ON openworld.* TO 'openworld'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Test connection
mysql -u openworld -p -h localhost openworld
```

#### Cause 5: Database Does Not Exist

**Diagnosis:**
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'openworld';"
# Shows empty result
```

**Solution:**
```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE openworld;"

# Run migrations to populate schema
cd /var/www/openworld-api
NODE_ENV=prod npm run migration:run

# Verify tables exist
mysql -u openworld -p -e "USE openworld; SHOW TABLES;"
```

#### Cause 6: Container Cannot Reach Host MySQL

**Diagnosis:**
```bash
# Test from within container
docker exec openworld-nocodb nc -zv localhost 3306
# Shows "Connection refused"
```

**Solution:**
```bash
# Check Docker network mode
docker inspect openworld-nocodb | grep -A 5 "NetworkMode"

# If using bridge network, MySQL must allow connections from Docker network
# Check MySQL bind address allows Docker connections

# Alternative: Use host network mode (edit docker-compose.nocodb.yml)
# Add: network_mode: "host"

# Restart container
sudo systemctl restart nocodb
```

### SSL Certificate Issues

**Symptoms:**
- Browser shows "Your connection is not private" or "NET::ERR_CERT_DATE_INVALID"
- "Certificate expired" error
- "Certificate not trusted" warning
- HTTPS access fails but HTTP works

**Diagnostic Commands:**
```bash
# 1. Check certificate status
sudo certbot certificates

# 2. Check certificate expiry date
sudo openssl x509 -in /etc/letsencrypt/live/openworld.heimerman.org/fullchain.pem -noout -dates

# 3. Check certificate details
sudo openssl x509 -in /etc/letsencrypt/live/openworld.heimerman.org/fullchain.pem -noout -text | grep -A 2 "Subject:"

# 4. Test SSL connection
openssl s_client -connect openworld.heimerman.org:443 -servername openworld.heimerman.org < /dev/null

# 5. Check Apache SSL configuration
sudo apache2ctl -t -D DUMP_VHOSTS | grep -A 20 "443"

# 6. Check certificate file permissions
sudo ls -la /etc/letsencrypt/live/openworld.heimerman.org/

# 7. Check certbot renewal timer
sudo systemctl status certbot.timer

# 8. Test certificate renewal (dry run)
sudo certbot renew --dry-run
```

**Common Causes and Solutions:**

#### Cause 1: Certificate Expired

**Diagnosis:**
```bash
sudo certbot certificates
# Shows "INVALID: EXPIRED" or expiry date in the past

sudo openssl x509 -in /etc/letsencrypt/live/openworld.heimerman.org/fullchain.pem -noout -dates
# Shows "notAfter" date in the past
```

**Solution:**
```bash
# Renew the certificate
sudo certbot renew

# If renewal fails, force renewal
sudo certbot renew --force-renewal

# Reload Apache to use new certificate
sudo systemctl reload apache2

# Verify new expiry date
sudo certbot certificates

# Test HTTPS access
curl -I https://openworld.heimerman.org/admin
```

#### Cause 2: Certificate Not Found

**Diagnosis:**
```bash
sudo ls -la /etc/letsencrypt/live/openworld.heimerman.org/
# Shows "No such file or directory"

sudo apache2ctl configtest
# Shows "SSLCertificateFile: file does not exist"
```

**Solution:**
```bash
# Obtain a new certificate
sudo certbot --apache -d openworld.heimerman.org

# Follow prompts to complete setup

# Verify certificate was created
sudo certbot certificates

# Reload Apache
sudo systemctl reload apache2
```

#### Cause 3: Automatic Renewal Not Working

**Diagnosis:**
```bash
sudo systemctl status certbot.timer
# Shows "inactive" or "failed"

sudo certbot renew --dry-run
# Shows errors
```

**Solution:**
```bash
# Enable certbot timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify timer is active
sudo systemctl status certbot.timer

# Test renewal process
sudo certbot renew --dry-run

# If dry run succeeds, renewal should work automatically
```

#### Cause 4: Wrong Certificate in Apache Configuration

**Diagnosis:**
```bash
sudo apache2ctl -t -D DUMP_VHOSTS | grep -A 20 "443"
# Shows certificate path that doesn't match certbot path
```

**Solution:**
```bash
# Edit Apache configuration
sudo nano /etc/apache2/sites-available/openworld.conf

# Ensure these lines point to correct certificate:
# SSLCertificateFile /etc/letsencrypt/live/openworld.heimerman.org/fullchain.pem
# SSLCertificateKeyFile /etc/letsencrypt/live/openworld.heimerman.org/privkey.pem

# Test configuration
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2
```

#### Cause 5: Certificate File Permissions

**Diagnosis:**
```bash
sudo ls -la /etc/letsencrypt/live/openworld.heimerman.org/
# Shows incorrect permissions or ownership
```

**Solution:**
```bash
# Fix permissions (certbot should handle this, but just in case)
sudo chmod 755 /etc/letsencrypt/live/
sudo chmod 755 /etc/letsencrypt/archive/
sudo chmod 644 /etc/letsencrypt/live/openworld.heimerman.org/*.pem

# Reload Apache
sudo systemctl reload apache2
```

### NocoDB Shows Blank Page

**Symptoms:**
- Accessing `/admin` loads but shows blank white page
- Browser console shows JavaScript errors
- Page loads partially then goes blank
- Infinite loading spinner

**Diagnostic Commands:**
```bash
# 1. Check browser console (F12 in most browsers)
# Look for JavaScript errors, CORS errors, or CSP violations

# 2. Check NocoDB container logs
docker logs openworld-nocodb --tail 100

# 3. Verify NC_PUBLIC_URL environment variable
docker exec openworld-nocodb env | grep NC_PUBLIC_URL

# 4. Check all environment variables
docker exec openworld-nocodb env | grep "^NC_"

# 5. Test direct access to container
curl -I http://localhost:8080

# 6. Check Apache headers
curl -I https://openworld.heimerman.org/admin

# 7. Verify Docker Compose configuration
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml config

# 8. Check container resource usage
docker stats openworld-nocodb --no-stream
```

**Common Causes and Solutions:**

#### Cause 1: Incorrect NC_PUBLIC_URL

**Diagnosis:**
```bash
docker exec openworld-nocodb env | grep NC_PUBLIC_URL
# Shows wrong URL or missing /admin path
# Example wrong: NC_PUBLIC_URL=https://openworld.heimerman.org
# Example correct: NC_PUBLIC_URL=https://openworld.heimerman.org/admin
```

**Solution:**
```bash
# Edit Docker Compose configuration
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml

# Ensure NC_PUBLIC_URL is set correctly:
# NC_PUBLIC_URL: "https://openworld.heimerman.org/admin"

# Restart container to apply changes
sudo systemctl restart nocodb

# Wait for startup
sleep 10

# Clear browser cache and reload
# Or test in incognito mode
```

#### Cause 2: Browser Cache Issues

**Diagnosis:**
- Page works in incognito/private mode
- Browser console shows 404 errors for cached resources

**Solution:**
```bash
# Clear browser cache:
# Chrome: Ctrl+Shift+Delete → Clear browsing data
# Firefox: Ctrl+Shift+Delete → Clear recent history
# Safari: Cmd+Option+E → Empty caches

# Or test in incognito/private mode:
# Chrome: Ctrl+Shift+N
# Firefox: Ctrl+Shift+P
# Safari: Cmd+Shift+N

# If works in incognito, cache was the issue
```

#### Cause 3: JavaScript Loading Errors

**Diagnosis:**
```bash
# Check browser console (F12) for errors like:
# "Failed to load resource"
# "Unexpected token '<'"
# "SyntaxError: Unexpected token"

# Check NocoDB logs
docker logs openworld-nocodb | grep -i error
```

**Solution:**
```bash
# Restart NocoDB container
sudo systemctl restart nocodb

# Wait for full startup
sleep 15

# Check logs for successful startup
docker logs openworld-nocodb | tail -20

# Should see: "NocoDB is ready on port 8080"

# Clear browser cache and reload
```

#### Cause 4: CORS or CSP Errors

**Diagnosis:**
```bash
# Browser console shows:
# "blocked by CORS policy"
# "Content Security Policy"

# Check Apache headers
curl -I https://openworld.heimerman.org/admin | grep -i "content-security\|access-control"
```

**Solution:**
```bash
# Verify Apache proxy preserves headers
sudo nano /etc/apache2/sites-available/openworld.conf

# Ensure ProxyPreserveHost is On:
# ProxyPreserveHost On

# Test Apache configuration
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2

# Test again
curl -I https://openworld.heimerman.org/admin
```

#### Cause 5: Container Out of Memory

**Diagnosis:**
```bash
docker stats openworld-nocodb --no-stream
# Shows very high memory usage (near limit)

docker logs openworld-nocodb | grep -i "memory\|oom"
# Shows out-of-memory errors
```

**Solution:**
```bash
# Restart container to free memory
sudo systemctl restart nocodb

# If problem persists, increase container memory limit
# Edit docker-compose.nocodb.yml
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml

# Add memory limit under service:
# deploy:
#   resources:
#     limits:
#       memory: 1G

# Restart with new limits
sudo systemctl restart nocodb
```

#### Cause 6: NocoDB Database Corruption

**Diagnosis:**
```bash
docker logs openworld-nocodb | grep -i "database\|sqlite\|corrupt"
# Shows database errors
```

**Solution:**
```bash
# Backup current NocoDB data
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups:/backup \
  alpine tar czf /backup/nocodb_backup_$(date +%Y%m%d).tar.gz -C /data .

# Stop NocoDB
sudo systemctl stop nocodb

# Remove corrupted database (WARNING: Loses NocoDB users and views)
docker run --rm -v nocodb_data:/data alpine rm /data/nocodb.db

# Start NocoDB (will create fresh database)
sudo systemctl start nocodb

# Reconfigure NocoDB through UI
# You'll need to create new user and reconnect to MySQL
```

### Container Keeps Restarting

**Symptoms:**
- `docker ps` shows container status as "Restarting (X) Y seconds ago"
- Container appears and disappears from `docker ps` output
- Service status shows "active" but container not running
- Logs show repeated startup attempts

**Diagnostic Commands:**
```bash
# 1. Check container status
docker ps -a | grep nocodb

# 2. View container logs (may show startup errors)
docker logs openworld-nocodb --tail 200

# 3. Check systemd logs
sudo journalctl -u nocodb -n 100 --no-pager

# 4. Check container exit code
docker inspect openworld-nocodb | grep -A 5 "State"

# 5. Check for port conflicts
sudo netstat -tlnp | grep 8080

# 6. Check Docker daemon logs
sudo journalctl -u docker -n 50 --no-pager

# 7. Check system resources
free -h
df -h /var/lib/docker

# 8. Validate Docker Compose configuration
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml config
```

**Common Causes and Solutions:**

#### Cause 1: Application Crash on Startup

**Diagnosis:**
```bash
docker logs openworld-nocodb --tail 100
# Shows error messages followed by container exit
# Example: "Error: Cannot find module"
# Example: "Uncaught exception"
```

**Solution:**
```bash
# Stop the restart loop
sudo systemctl stop nocodb

# Remove the container
docker rm -f openworld-nocodb

# Pull fresh image
docker pull nocodb/nocodb:latest

# Start with fresh container
sudo systemctl start nocodb

# Monitor logs for successful startup
docker logs -f openworld-nocodb
# Should see: "NocoDB is ready on port 8080"
```

#### Cause 2: Port Already in Use

**Diagnosis:**
```bash
docker logs openworld-nocodb | grep -i "address already in use\|EADDRINUSE"
# Shows port conflict error

sudo netstat -tlnp | grep 8080
# Shows another process using port 8080
```

**Solution:**
```bash
# Stop NocoDB
sudo systemctl stop nocodb

# Find conflicting process
sudo lsof -i :8080

# Kill conflicting process
sudo kill <PID>

# Or change NocoDB port in docker-compose.nocodb.yml
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml
# Change: ports: "127.0.0.1:8081:8080"

# Update Apache proxy to match new port
sudo nano /etc/apache2/sites-available/openworld.conf
# Change: ProxyPass /admin http://localhost:8081/admin

# Restart services
sudo systemctl restart nocodb
sudo systemctl reload apache2
```

#### Cause 3: Volume Permission Issues

**Diagnosis:**
```bash
docker logs openworld-nocodb | grep -i "permission denied\|EACCES"
# Shows permission errors

docker volume inspect nocodb_data
# Check Mountpoint permissions
```

**Solution:**
```bash
# Stop service
sudo systemctl stop nocodb

# Remove container
docker rm -f openworld-nocodb

# Fix volume permissions
docker run --rm -v nocodb_data:/data alpine chmod -R 777 /data

# Start service
sudo systemctl start nocodb

# If still fails, recreate volume (WARNING: Deletes NocoDB data)
docker volume rm nocodb_data
docker volume create nocodb_data
sudo systemctl start nocodb
```

#### Cause 4: Out of Memory

**Diagnosis:**
```bash
docker logs openworld-nocodb | grep -i "out of memory\|oom\|killed"
# Shows memory-related errors

dmesg | grep -i "out of memory"
# Shows kernel OOM killer messages

free -h
# Shows very low available memory
```

**Solution:**
```bash
# Check memory usage
free -h

# Stop non-essential services to free memory
# (Be careful not to stop critical services)

# Add memory limit to prevent OOM
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml

# Add under service:
# deploy:
#   resources:
#     limits:
#       memory: 512M
#     reservations:
#       memory: 256M

# Restart service
sudo systemctl restart nocodb

# Monitor memory usage
docker stats openworld-nocodb
```

#### Cause 5: Corrupted Docker Image

**Diagnosis:**
```bash
docker logs openworld-nocodb | grep -i "exec format error\|no such file"
# Shows image corruption errors

docker inspect nocodb/nocodb:latest | grep -i "architecture"
# Shows wrong architecture
```

**Solution:**
```bash
# Stop service
sudo systemctl stop nocodb

# Remove container and image
docker rm -f openworld-nocodb
docker rmi nocodb/nocodb:latest

# Pull fresh image
docker pull nocodb/nocodb:latest

# Verify image
docker images | grep nocodb

# Start service
sudo systemctl start nocodb

# Monitor startup
docker logs -f openworld-nocodb
```

#### Cause 6: Invalid Environment Variables

**Diagnosis:**
```bash
docker logs openworld-nocodb | grep -i "invalid\|environment\|config"
# Shows configuration errors

docker exec openworld-nocodb env | grep "^NC_"
# Shows malformed environment variables
```

**Solution:**
```bash
# Stop service
sudo systemctl stop nocodb

# Validate Docker Compose configuration
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml config

# Fix any syntax errors in docker-compose.nocodb.yml
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml

# Ensure environment variables are properly quoted:
# NC_PUBLIC_URL: "https://openworld.heimerman.org/admin"
# NC_DISABLE_TELE: "true"

# Start service
sudo systemctl start nocodb
```

### Rollback Procedures

If you need to rollback the NocoDB deployment due to issues, follow these procedures:

#### Complete Rollback (Remove NocoDB Entirely)

U

**Weekly:**
- Check container status: `docker ps | grep nocodb`
- Review logs for errors: `docker logs openworld-nocodb --tail 100`
- Verify admin access: Visit https://openworld.heimerman.org/admin

**Monthly:**
- Update NocoDB image: See "Updating NocoDB" below
- Backup NocoDB metadata: See "Backup and Restore" below
- Review NocoDB audit logs (via UI: Settings → Audit)

### Updating NocoDB

To update to the latest NocoDB version:

```bash
# Pull the latest image
docker pull nocodb/nocodb:latest

# Restart the service (will use new image)
sudo systemctl restart nocodb

# Verify new version
docker logs openworld-nocodb | grep -i version
```

**Note:** NocoDB updates are usually backward compatible, but check release notes for breaking changes.

### Backup and Restore

#### Backup NocoDB Metadata

NocoDB stores its own data (user accounts, views, settings) in a Docker volume:

```bash
# Create backup directory
mkdir -p ~/backups/nocodb

# Backup the volume
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# List backups
ls -lh ~/backups/nocodb/
```

#### Restore NocoDB Metadata

```bash
# Stop NocoDB
sudo systemctl stop nocodb

# Restore from backup
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine sh -c "cd /data && tar xzf /backup/nocodb_data_YYYYMMDD_HHMMSS.tar.gz"

# Start NocoDB
sudo systemctl start nocodb
```

#### Database Backup

The MySQL database is backed up separately (see `MAINTENANCE.md`):

```bash
# Backup database
mysqldump -u openworld -p openworld > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use the backup script
/var/www/openworld-api/deployment/backup-db.sh
```

**Note:** NocoDB doesn't store game data - it only provides an interface to view/edit the MySQL database.

### Monitoring

#### Health Checks

Add this to your monitoring system:

```bash
# Check if NocoDB is responding
curl -f http://localhost:8080/api/v1/health || echo "NocoDB is down"

# Check container status
docker ps --filter "name=openworld-nocodb" --format "{{.Status}}" | grep -q "Up" || echo "Container is not running"

# Check systemd service
systemctl is-active --quiet nocodb || echo "Service is not active"
```

#### Log Monitoring

```bash
# View recent logs
sudo journalctl -u nocodb -n 100

# Follow logs in real-time
sudo journalctl -u nocodb -f

# View Docker logs
docker logs openworld-nocodb --tail 100 -f
```

### Stopping and Starting

```bash
# Stop NocoDB
sudo systemctl stop nocodb

# Start NocoDB
sudo systemctl start nocodb

# Restart NocoDB
sudo systemctl restart nocodb

# Check status
sudo systemctl status nocodb
```

### Rollback Procedures

If you encounter issues during or after deployment, use these rollback procedures to safely revert changes.

#### Rollback Scenario 1: Issues During Initial Deployment

**When to use:** NocoDB deployment fails and you want to return to pre-deployment state.

**Steps:**

```bash
# 1. Stop NocoDB service (if it was started)
sudo systemctl stop nocodb 2>/dev/null

# 2. Disable systemd service
sudo systemctl disable nocodb 2>/dev/null

# 3. Remove systemd service file
sudo rm -f /etc/systemd/system/nocodb.service
sudo systemctl daemon-reload

# 4. Remove Docker container and volume
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml down -v

# 5. Restore Apache configuration from backup
sudo cp /etc/apache2/sites-available/openworld.conf.backup /etc/apache2/sites-available/openworld.conf

# 6. Test Apache configuration
sudo apache2ctl configtest

# 7. Reload Apache
sudo systemctl reload apache2

# 8. Verify main application still works
curl -I https://openworld.heimerman.org

# 9. Rollback admin user migration (optional)
cd /var/www/openworld-api
NODE_ENV=prod npm run migration:revert
```

**Verification:**
- Main application accessible at https://openworld.heimerman.org
- No NocoDB container running: `docker ps | grep nocodb` (should show nothing)
- No systemd service: `systemctl status nocodb` (should show "not found")

#### Rollback Scenario 2: NocoDB Working But Need to Revert Apache Changes

**When to use:** NocoDB is running but Apache proxy configuration causes issues with main application.

**Steps:**

```bash
# 1. Restore Apache configuration from backup
sudo cp /etc/apache2/sites-available/openworld.conf.backup /etc/apache2/sites-available/openworld.conf

# 2. Test Apache configuration
sudo apache2ctl configtest

# 3. Reload Apache (no downtime)
sudo systemctl reload apache2

# 4. Verify main application works
curl -I https://openworld.heimerman.org

# 5. NocoDB still accessible via direct port (for testing)
curl -I http://localhost:8080

# Note: NocoDB container continues running, just not accessible via /admin
```

**To restore /admin access later:**
```bash
# Re-apply Apache configuration
sudo cp /etc/apache2/sites-available/openworld.conf.backup /etc/apache2/sites-available/openworld.conf.original
# Edit openworld.conf to add /admin proxy rules
sudo nano /etc/apache2/sites-available/openworld.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

#### Rollback Scenario 3: Revert to Previous NocoDB Version

**When to use:** NocoDB update causes issues and you need to revert to previous version.

**Steps:**

```bash
# 1. Stop NocoDB
sudo systemctl stop nocodb

# 2. Backup current NocoDB data (just in case)
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_rollback_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# 3. Remove current container
docker rm -f openworld-nocodb

# 4. Remove current image
docker rmi nocodb/nocodb:latest

# 5. Pull specific previous version (replace X.Y.Z with version number)
docker pull nocodb/nocodb:0.X.Y

# 6. Update docker-compose.nocodb.yml to use specific version
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml
# Change: image: nocodb/nocodb:0.X.Y

# 7. Start NocoDB with previous version
sudo systemctl start nocodb

# 8. Verify it's running
docker ps | grep nocodb
docker logs openworld-nocodb

# 9. Test access
curl -I https://openworld.heimerman.org/admin
```

**To find previous version numbers:**
```bash
# Check Docker Hub for available versions
# Visit: https://hub.docker.com/r/nocodb/nocodb/tags

# Or check local image history
docker images nocodb/nocodb --format "{{.Tag}}"
```

#### Rollback Scenario 4: Restore NocoDB Data from Backup

**When to use:** NocoDB metadata corrupted or accidentally deleted users/views.

**Steps:**

```bash
# 1. Stop NocoDB
sudo systemctl stop nocodb

# 2. List available backups
ls -lh ~/backups/nocodb/

# 3. Restore from backup (replace filename with your backup)
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/nocodb_data_YYYYMMDD_HHMMSS.tar.gz"

# 4. Start NocoDB
sudo systemctl start nocodb

# 5. Verify restoration
docker logs openworld-nocodb
curl -I https://openworld.heimerman.org/admin

# 6. Log in and verify users/views are restored
```

**Note:** This only restores NocoDB metadata (users, views, settings). Database data is separate.

#### Rollback Scenario 5: Revert Database Changes Made Through NocoDB

**When to use:** Accidental data changes made through NocoDB interface need to be reverted.

**Steps:**

```bash
# 1. Stop all services to prevent further changes
sudo systemctl stop nocodb
sudo systemctl stop openworld-api

# 2. Restore database from backup (replace filename)
mysql -u root -p openworld < ~/backups/openworld_backup_YYYYMMDD_HHMMSS.sql

# Or use the backup script's restore function
# (Assuming backup script has restore capability)

# 3. Verify database restoration
mysql -u openworld -p -e "USE openworld; SELECT COUNT(*) FROM players;"

# 4. Restart services
sudo systemctl start openworld-api
sudo systemctl start nocodb

# 5. Verify both services are working
curl -I https://openworld.heimerman.org
curl -I https://openworld.heimerman.org/admin
```

**Prevention:** Always backup database before bulk operations:
```bash
mysqldump -u openworld -p openworld > backup_before_changes_$(date +%Y%m%d_%H%M%S).sql
```

#### Emergency Rollback: Complete Removal

**When to use:** Critical issues require immediate removal of all NocoDB components.

**Steps:**

```bash
# 1. Stop and disable service
sudo systemctl stop nocodb
sudo systemctl disable nocodb

# 2. Remove systemd service
sudo rm -f /etc/systemd/system/nocodb.service
sudo systemctl daemon-reload

# 3. Remove Docker resources
docker stop openworld-nocodb 2>/dev/null
docker rm -f openworld-nocodb 2>/dev/null
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml down -v 2>/dev/null

# 4. Restore Apache configuration
sudo cp /etc/apache2/sites-available/openworld.conf.backup /etc/apache2/sites-available/openworld.conf
sudo apache2ctl configtest
sudo systemctl reload apache2

# 5. Verify main application
curl -I https://openworld.heimerman.org

# 6. Clean up Docker resources (optional)
docker rmi nocodb/nocodb:latest 2>/dev/null
docker volume rm nocodb_data 2>/dev/null

# 7. Revert admin user migration (optional)
cd /var/www/openworld-api
NODE_ENV=prod npm run migration:revert
```

**Verification checklist:**
- [ ] Main application accessible
- [ ] No NocoDB container: `docker ps | grep nocodb`
- [ ] No systemd service: `systemctl list-units | grep nocodb`
- [ ] Apache serving main app correctly
- [ ] No errors in Apache logs: `sudo tail /var/log/apache2/openworld-ssl-error.log`

#### Rollback Best Practices

1. **Always backup before changes:**
   ```bash
   # Backup NocoDB data
   docker run --rm -v nocodb_data:/data -v ~/backups:/backup \
     alpine tar czf /backup/nocodb_$(date +%Y%m%d).tar.gz -C /data .
   
   # Backup database
   mysqldump -u openworld -p openworld > backup_$(date +%Y%m%d).sql
   
   # Backup Apache config
   sudo cp /etc/apache2/sites-available/openworld.conf \
     /etc/apache2/sites-available/openworld.conf.backup.$(date +%Y%m%d)
   ```

2. **Test in stages:**
   - Deploy to staging environment first (if available)
   - Test each component individually
   - Verify main application still works after each change

3. **Document changes:**
   - Keep notes of what was changed
   - Save original configuration files
   - Record version numbers

4. **Monitor after deployment:**
   - Watch logs for errors: `sudo journalctl -u nocodb -f`
   - Check resource usage: `docker stats openworld-nocodb`
   - Verify both main app and admin interface work

5. **Have rollback plan ready:**
   - Know the rollback steps before deploying
   - Keep backup files accessible
   - Test rollback procedure in non-production environment

### Uninstalling

If you need to permanently remove NocoDB:

```bash
# Stop and disable the service
sudo systemctl stop nocodb
sudo systemctl disable nocodb

# Remove the service file
sudo rm /etc/systemd/system/nocodb.service
sudo systemctl daemon-reload

# Remove the container
docker-compose -f /var/www/openworld-api/deployment/docker-compose.nocodb.yml down

# Remove the volume (WARNING: This deletes all NocoDB data)
docker volume rm nocodb_data

# Remove the image
docker rmi nocodb/nocodb:latest

# Remove Apache configuration
# Edit /etc/apache2/sites-available/openworld.conf
# Remove the /admin ProxyPass and WebSocket rules
sudo systemctl reload apache2
```

## Security Considerations

### Network Security

- **Port 8080 is bound to localhost only** - Not exposed to the internet
- **External access only via Apache reverse proxy** - With HTTPS encryption
- **No direct database access from internet** - MySQL listens on localhost only

### Authentication

- **NocoDB has its own user system** - Separate from application player accounts
- **First user becomes admin** - Create this account carefully
- **Use strong passwords** - For both NocoDB and database access

### Data Protection

- **Database credentials in .env.prod** - Protected with 600 permissions
- **Regular backups** - Both database and NocoDB metadata
- **Audit logs** - NocoDB tracks all changes (Settings → Audit)

### Best Practices

1. **Limit NocoDB users** - Only create accounts for authorized admins
2. **Use read-only database user** (optional) - For safer viewing:
   ```sql
   CREATE USER 'openworld_readonly'@'localhost' IDENTIFIED BY 'password';
   GRANT SELECT ON openworld.* TO 'openworld_readonly'@'localhost';
   ```
3. **Regular updates** - Keep NocoDB image updated
4. **Monitor audit logs** - Review changes regularly
5. **Backup before major changes** - Backup database before bulk edits

## Additional Resources

### Documentation

- **NocoDB Official Docs:** https://docs.nocodb.com/
- **Docker Documentation:** https://docs.docker.com/
- **Systemd Service Documentation:** `man systemd.service`

### Related Files

- `DEPLOYMENT_GUIDE.md` - Main application deployment
- `MAINTENANCE.md` - Daily operations and troubleshooting
- `docker-compose.nocodb.yml` - Docker Compose configuration
- `nocodb.service` - Systemd service definition
- `apache-openworld.conf` - Apache configuration

### Support

For issues:
1. Check NocoDB logs: `docker logs openworld-nocodb`
2. Check systemd logs: `sudo journalctl -u nocodb`
3. Check Apache logs: `/var/log/apache2/openworld-ssl-error.log`
4. Review this troubleshooting section
5. Check NocoDB GitHub issues: https://github.com/nocodb/nocodb/issues

## Summary

You've successfully deployed NocoDB as a database admin interface! Here's what you accomplished:

✓ Installed Docker and Docker Compose
✓ Created systemd service for automatic startup
✓ Configured Apache reverse proxy for HTTPS access
✓ Created admin user account
✓ Started NocoDB container
✓ Connected NocoDB to MySQL database
✓ Verified deployment with checklist

**Next steps:**
- Create additional NocoDB user accounts for other admins
- Explore NocoDB features (views, filters, forms)
- Set up regular backups
- Add monitoring/alerting

**Access your admin interface:** https://openworld.heimerman.org/admin
