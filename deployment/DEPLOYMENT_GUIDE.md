# Openworld API Deployment Guide

This guide walks you through deploying the Openworld API to your VPS at openworld.heimerman.org.

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
# Log into MySQL as root
sudo mysql -u root -p

# Create database and user
CREATE DATABASE openworld CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'openworld'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON openworld.* TO 'openworld'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Create Application Directory

```bash
# Create directory
sudo mkdir -p /var/www/openworld-api
sudo chown $USER:$USER /var/www/openworld-api

# Create log directory
sudo mkdir -p /var/log/openworld-api
sudo chown $USER:$USER /var/log/openworld-api
```

## Step 4: Deploy Application Code

### Option A: Using Git (Recommended)

```bash
cd /var/www/openworld-api

# Clone your repository
git clone YOUR_REPO_URL .

# Install dependencies
npm ci --production

# Build the application
npm run build
```

### Option B: Using rsync from local machine

```bash
# Run this from your LOCAL machine (not VPS)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dev.sqlite' --exclude 'test.sqlite' \
  ./ user@openworld.heimerman.org:/var/www/openworld-api/

# Then SSH to VPS and install
ssh user@openworld.heimerman.org
cd /var/www/openworld-api
npm ci --production
npm run build
```

## Step 5: Configure Production Settings

```bash
cd /var/www/openworld-api

# Edit the database config
nano ormconfig.ts

# Update the prod section with your MySQL password from Step 2:
# prod: {
#   ...
#   password: 'YOUR_SECURE_PASSWORD',
#   ...
# }
```

**Note:** The JWT secret is currently hardcoded in `src/constants.ts`. For production use, you'll want to move this and database credentials to environment variables. See GitHub issue for tracking.

## Step 6: Run Database Migrations

```bash
cd /var/www/openworld-api

# Run migrations to set up database schema
NODE_ENV=prod npm run migration:run
```

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
npm ci --production

# Rebuild
npm run build

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

# Verify environment variables
cd /var/www/openworld-api
cat config/.env.prod
```

### Database connection issues

```bash
# Test MySQL connection
mysql -u openworld -p -h localhost openworld

# Check MySQL is running
sudo systemctl status mysql

# Verify user permissions
sudo mysql -u root -p
SHOW GRANTS FOR 'openworld'@'localhost';
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

3. **Regular Updates**
```bash
sudo apt-get update
sudo apt-get upgrade
```

4. **Backup Strategy**: Set up automated database backups

5. **Monitoring**: Consider setting up monitoring (e.g., PM2 Plus, New Relic)

## Support

For issues specific to the application, check:
- Application logs: `pm2 logs openworld-api`
- Apache logs: `/var/log/apache2/openworld-*.log`
- MySQL logs: `/var/log/mysql/error.log`
