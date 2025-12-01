# Openworld API Deployment Guide

This guide walks you through deploying the Openworld API to your VPS at openworld.heimerman.org.

## Quick Reference

### Required Environment Variables

All production deployments require a `.env.prod` file at `/var/www/openworld-api/.env.prod` with these variables:

| Variable | Purpose | Generate With |
|----------|---------|---------------|
| `NODE_ENV` | Environment identifier | Set to `prod` |
| `DB_TYPE` | Database type | Set to `mysql` |
| `DB_HOST` | Database hostname | Set to `localhost` |
| `DB_PORT` | Database port | Set to `3306` |
| `DB_USERNAME` | Database username | Set to `openworld` |
| `DB_PASSWORD` | Database password | `openssl rand -base64 32` |
| `DB_NAME` | Database name | Set to `openworld` |
| `JWT_SECRET` | JWT signing key | `openssl rand -base64 64` |

**Security:** File must have `600` permissions and must NOT be committed to git.

### Key File Locations

- Application: `/var/www/openworld-api/`
- Environment config: `/var/www/openworld-api/.env.prod`
- Application logs: `/var/log/openworld-api/`
- Apache config: `/etc/apache2/sites-available/openworld.conf`
- PM2 config: `/var/www/openworld-api/deployment/ecosystem.config.js`

## Prerequisites

- VPS with Ubuntu/Debian (or similar)
- Root or sudo access
- MySQL installed
- Apache installed
- Domain DNS pointing to your VPS

## Step 1: Upgrade Node.js and Install PM2

```bash
# Remove old Node.js 14
sudo apt-get remove -y nodejs
sudo apt-get autoremove -y

# Remove old NodeSource repository if it exists
sudo rm -f /etc/apt/sources.list.d/nodesource.list

# Install Node.js 25.x (matches your dev environment)
curl -fsSL https://deb.nodesource.com/setup_25.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v25.x.x
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Set up PM2 to start on boot
pm2 startup systemd
# Follow the command it outputs (copy/paste the command it gives you)
```

## Step 2: Set Up MySQL Database

```bash
# Generate a secure database password first
openssl rand -base64 32 | tr -d '\n' && echo
# Save this password - you'll need it for the .env.prod file in Step 5

# Log into MySQL as root
sudo mysql -u root -p

# Create database and user (replace YOUR_SECURE_PASSWORD with the generated password)
CREATE DATABASE openworld CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'openworld'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON openworld.* TO 'openworld'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Important:** Save the database password you generated - you'll need it when creating the `.env.prod` file in Step 5.

## Step 3: Create Application Directories

```bash
# Create build directory (where we compile the app)
mkdir -p ~/work/openworld-api

# Create production directory (where the app runs)
sudo mkdir -p /var/www/openworld-api
sudo chown $USER:$USER /var/www/openworld-api

# Create log directory
sudo mkdir -p /var/log/openworld-api
sudo chown $USER:$USER /var/log/openworld-api
```

**Note:** We build in `~/work/openworld-api` (with dev dependencies) and deploy only compiled output to `/var/www/openworld-api` (production-only).

## Step 4: Deploy Application Code

Clone the repository to the build directory:

```bash
cd ~/work/openworld-api
git clone YOUR_REPO_URL .
```

For initial deployment, use the deployment script or follow the manual steps in `deployment/MAINTENANCE.md`.

### Option B: Using rsync from local machine

```bash
# Run this from your LOCAL machine (not VPS)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dev.sqlite' --exclude 'test.sqlite' \
  ./ user@openworld.heimerman.org:/var/www/openworld-api/

# Then SSH to VPS and install
ssh user@openworld.heimerman.org
cd /var/www/openworld-api
npm ci
npm run build
npm prune --production  # Optional: remove dev dependencies after build
```

## Step 5: Configure Environment Variables

The application uses environment variables for all sensitive configuration. You must create a production environment file before starting the application.

### Create Production Environment File

```bash
cd /var/www/openworld-api

# Create the production environment file
sudo nano .env.prod
```

### Required Environment Variables

Add the following content to `/var/www/openworld-api/.env.prod`:

```bash
# Node Environment
NODE_ENV=prod

# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=openworld
DB_PASSWORD=YOUR_SECURE_DATABASE_PASSWORD
DB_NAME=openworld

# JWT Authentication
JWT_SECRET=YOUR_SECURE_JWT_SECRET
```

### Environment Variable Reference

| Variable | Required | Description | Example Value |
|----------|----------|-------------|---------------|
| `NODE_ENV` | Yes | Application environment | `prod` |
| `DB_TYPE` | Yes | Database type | `mysql` (production) or `sqlite` (dev/test) |
| `DB_HOST` | Yes (MySQL) | Database server hostname | `localhost` |
| `DB_PORT` | Yes (MySQL) | Database server port | `3306` |
| `DB_USERNAME` | Yes (MySQL) | Database username | `openworld` |
| `DB_PASSWORD` | Yes (MySQL) | Database password | See credential generation below |
| `DB_NAME` | Yes | Database name | `openworld` |
| `JWT_SECRET` | Yes | Secret key for JWT token signing | See credential generation below |

### Generate Secure Credentials

**IMPORTANT:** You must generate new, secure credentials for production. Never use the example values or any credentials that were previously committed to the repository.

```bash
# Generate a secure JWT secret (64 characters)
openssl rand -base64 64 | tr -d '\n' && echo

# Generate a secure database password (32 characters)
openssl rand -base64 32 | tr -d '\n' && echo
```

Copy these generated values into your `.env.prod` file.

### Set File Permissions

The environment file contains sensitive credentials and must be protected:

```bash
# Set restrictive permissions (readable only by owner)
sudo chmod 600 /var/www/openworld-api/.env.prod

# Ensure the file is owned by the user running the application
sudo chown $USER:$USER /var/www/openworld-api/.env.prod
```

### Verify Configuration

```bash
# Verify file permissions (should show -rw-------)
ls -la /var/www/openworld-api/.env.prod

# Verify file ownership
stat /var/www/openworld-api/.env.prod
```

**Security Note:** The `.env.prod` file should NEVER be committed to version control. Verify that `*.env.prod` is in your `.gitignore` file.

### Example .env.prod Template

Here's a complete template for your production environment file. Replace all placeholder values with your actual credentials:

```bash
# =============================================================================
# Openworld API Production Environment Configuration
# =============================================================================
# 
# SECURITY WARNING: This file contains sensitive credentials
# - Never commit this file to version control
# - Keep file permissions set to 600 (readable only by owner)
# - Store backups securely (encrypted)
# - Rotate credentials regularly
#
# =============================================================================

# Node Environment
NODE_ENV=prod

# Database Configuration
# MySQL connection settings for production database
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=openworld
DB_PASSWORD=REPLACE_WITH_GENERATED_DATABASE_PASSWORD
DB_NAME=openworld

# JWT Authentication
# Secret key for signing and verifying JWT tokens
# Generate with: openssl rand -base64 64 | tr -d '\n'
JWT_SECRET=REPLACE_WITH_GENERATED_JWT_SECRET

# =============================================================================
# Credential Generation Commands:
# =============================================================================
# Database Password (32 chars): openssl rand -base64 32 | tr -d '\n'
# JWT Secret (64 chars):        openssl rand -base64 64 | tr -d '\n'
# =============================================================================
```

Copy this template to `/var/www/openworld-api/.env.prod` and replace the placeholder values with your generated credentials.

## Step 6: Run Database Migrations

```bash
cd /var/www/openworld-api

# Run migrations to set up database schema
NODE_ENV=prod npm run migration:run
```

The application will automatically load database credentials from `/var/www/openworld-api/.env.prod` when `NODE_ENV=prod`.

## Step 7: Configure Apache

```bash
# Enable required Apache modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl

# Copy Apache config
sudo cp deployment/apache-openworld.conf /etc/apache2/sites-available/openworld.conf

# Enable the site
sudo a2ensite openworld.conf

# Test Apache configuration
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2
```

## Step 8: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d openworld.heimerman.org

# Certbot will automatically:
# - Obtain the certificate
# - Update your Apache config
# - Set up auto-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 9: Start the Application with PM2

```bash
cd /var/www/openworld-api

# Start the application
pm2 start deployment/ecosystem.config.js

# Save PM2 process list
pm2 save

# Check status
pm2 status
pm2 logs openworld-api
```

### How Environment Variables are Loaded

The application uses `dotenv-extended` to automatically load environment variables based on `NODE_ENV`:

- **Production** (`NODE_ENV=prod`): Loads from `/var/www/openworld-api/.env.prod`
- **Development** (`NODE_ENV=dev`): Loads from `config/.env.dev`
- **Test** (`NODE_ENV=test`): Loads from `config/.env.test`

The PM2 ecosystem configuration (`deployment/ecosystem.config.js`) sets `NODE_ENV=prod`, which tells the application to load `/var/www/openworld-api/.env.prod`. The ecosystem config only contains non-sensitive values like `NODE_ENV` and `PORT` - all sensitive credentials are loaded from the `.env.prod` file.

**Note:** PM2 does not need to be configured with environment variables directly. The application handles loading them from the appropriate `.env` file based on `NODE_ENV`.

## Step 10: Verify Deployment

```bash
# Check if app is running locally
curl http://localhost:3000

# Check if accessible via domain (HTTP will redirect to HTTPS)
curl -I http://openworld.heimerman.org

# Check HTTPS
curl https://openworld.heimerman.org
```

Visit in browser: https://openworld.heimerman.org

## Useful Commands

### Application Management

```bash
# View logs
pm2 logs openworld-api

# Restart application
pm2 restart openworld-api

# Stop application
pm2 stop openworld-api

# Monitor resources
pm2 monit
```

### Deployment Updates

```bash
cd /var/www/openworld-api

# Pull latest code
git pull

# Install any new dependencies
npm ci

# Rebuild
npm run build

# Optional: Remove dev dependencies after build
npm prune --production

# Run any new migrations
NODE_ENV=prod npm run migration:run

# Restart application
pm2 restart openworld-api
```

### Database Management

```bash
# Backup database
mysqldump -u openworld -p openworld > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
mysql -u openworld -p openworld < backup_file.sql
```

### Apache Management

```bash
# Test configuration
sudo apache2ctl configtest

# Reload configuration
sudo systemctl reload apache2

# Restart Apache
sudo systemctl restart apache2

# View logs
sudo tail -f /var/log/apache2/openworld-ssl-error.log
sudo tail -f /var/log/apache2/openworld-ssl-access.log
```

## Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs openworld-api --lines 100

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000

# Verify environment file exists and has correct permissions
ls -la /var/www/openworld-api/.env.prod

# Check environment variables are loaded (without exposing values)
cd /var/www/openworld-api
grep -v "PASSWORD\|SECRET" .env.prod
```

### Environment variable issues

```bash
# Verify .env.prod file exists
ls -la /var/www/openworld-api/.env.prod

# Check file permissions (should be -rw-------)
stat /var/www/openworld-api/.env.prod

# Verify NODE_ENV is set correctly
pm2 show openworld-api | grep NODE_ENV

# Check for missing required variables (application will log specific errors)
pm2 logs openworld-api --lines 50 | grep -i "missing\|required\|environment"

# Verify environment variables are being loaded (without exposing secrets)
cd /var/www/openworld-api
grep "^[A-Z]" .env.prod | grep -v "PASSWORD\|SECRET"
```

Common environment variable errors:
- `Missing required environment variable: JWT_SECRET` - JWT_SECRET not set in .env.prod
- `Missing required environment variable: DB_PASSWORD` - DB_PASSWORD not set in .env.prod
- `ENOENT: no such file or directory` - .env.prod file doesn't exist
- `EACCES: permission denied` - .env.prod file permissions are too restrictive

### Database connection issues

```bash
# Test MySQL connection with credentials from .env.prod
mysql -u openworld -p -h localhost openworld

# Check MySQL is running
sudo systemctl status mysql

# Verify user permissions
sudo mysql -u root -p
SHOW GRANTS FOR 'openworld'@'localhost';

# Check if database password matches .env.prod
# (Compare the password you enter for mysql command with DB_PASSWORD in .env.prod)
```

### Apache/SSL issues

```bash
# Check Apache error logs
sudo tail -f /var/log/apache2/error.log

# Verify SSL certificate
sudo certbot certificates

# Test Apache config
sudo apache2ctl configtest
```

### 502 Bad Gateway

This usually means Apache can't reach the Node app:

```bash
# Check if Node app is running
pm2 status

# Check if listening on port 3000
curl http://localhost:3000

# Restart the app
pm2 restart openworld-api
```

## Credential Rotation

### First-Time Migration

**If you're deploying after the environment variable migration for the first time**, see `deployment/CREDENTIAL_MIGRATION.md` for one-time setup instructions including rotating the previously exposed credentials.

### Periodic Rotation

Rotate credentials periodically or immediately if compromised:

### Rotating the JWT Secret

```bash
# Generate a new JWT secret
openssl rand -base64 64 | tr -d '\n' && echo

# Update the .env.prod file
sudo nano /var/www/openworld-api/.env.prod
# Replace the JWT_SECRET value with the new secret

# Restart the application
pm2 restart openworld-api
```

**Important:** Rotating the JWT secret will invalidate all existing user sessions. Users will need to log in again.

### Rotating the Database Password

```bash
# Generate a new database password
openssl rand -base64 32 | tr -d '\n' && echo

# Update MySQL user password
sudo mysql -u root -p
ALTER USER 'openworld'@'localhost' IDENTIFIED BY 'NEW_SECURE_PASSWORD';
FLUSH PRIVILEGES;
EXIT;

# Update the .env.prod file
sudo nano /var/www/openworld-api/.env.prod
# Replace the DB_PASSWORD value with the new password

# Restart the application
pm2 restart openworld-api
```

### Credential Rotation Schedule

Recommended rotation schedule:
- **JWT Secret**: Every 90 days or immediately if compromised
- **Database Password**: Every 180 days or immediately if compromised
- **After Security Incident**: Rotate all credentials immediately

### Verifying Credential Rotation

After rotating credentials:

```bash
# Check application logs for successful startup
pm2 logs openworld-api --lines 50

# Test authentication endpoint
curl -X POST https://openworld.heimerman.org/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Verify database connectivity
pm2 logs openworld-api | grep -i "database\|mysql"
```

## Security Recommendations

1. **Firewall**: Configure UFW to only allow necessary ports
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

2. **MySQL**: Ensure MySQL only listens on localhost
```bash
# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Verify: bind-address = 127.0.0.1
```

3. **Environment File Security**
```bash
# Verify .env.prod has restrictive permissions
ls -la /var/www/openworld-api/.env.prod  # Should show -rw-------

# Verify .env.prod is not in git
cd /var/www/openworld-api
git status  # Should not show .env.prod

# Verify .gitignore includes production env files
grep "\.env\.prod" .gitignore
```

4. **Regular Updates**
```bash
sudo apt-get update
sudo apt-get upgrade
```

5. **Backup Strategy**: Set up automated database backups

6. **Monitoring**: Consider setting up monitoring (e.g., PM2 Plus, New Relic)

7. **Credential Rotation**: Follow the credential rotation schedule above

## Support

For issues specific to the application, check:
- Application logs: `pm2 logs openworld-api`
- Apache logs: `/var/log/apache2/openworld-*.log`
- MySQL logs: `/var/log/mysql/error.log`
