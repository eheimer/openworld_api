# One-Time Credential Migration Guide

**Purpose**: This document provides one-time instructions for migrating from hardcoded credentials to environment variables. This is only needed when deploying the environment variable changes for the first time.

**When to use this**: If you're deploying the application after the environment variable migration (commit: "migrate hardcoded credentials to environment variables"), follow these steps once.

---

## Background

Previous versions of this application had credentials hardcoded in source code and committed to the public repository:
- Database password: `entranced`
- JWT secret: `secretKey`

These credentials are **permanently compromised** and must be rotated. This guide walks you through the one-time migration process.

---

## Migration Steps

### 1. Generate New Secure Credentials

```bash
# Generate new JWT secret (64+ characters)
openssl rand -base64 64 | tr -d '\n' && echo

# Generate new database password (32+ characters)
openssl rand -base64 32 | tr -d '\n' && echo
```

**Save these values immediately in a secure password manager.**

### 2. Update MySQL Database Password

On the production server:

```bash
# Connect to MySQL as root
mysql -u root -p

# Update the password for the openworld user
ALTER USER 'openworld'@'localhost' IDENTIFIED BY 'NEW_PASSWORD_FROM_STEP_1';
FLUSH PRIVILEGES;
EXIT;

# Test the new password
mysql -u openworld -p openworld
# Enter the new password - should connect successfully
```

### 3. Create Production Environment File

```bash
# Create the production environment file
sudo nano /var/www/openworld-api/.env.prod
```

Copy the template from `deployment/.env.prod.example` and replace ALL placeholder values:

```bash
NODE_ENV=prod
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=openworld
DB_PASSWORD=<paste_database_password_from_step_1>
DB_NAME=openworld
JWT_SECRET=<paste_jwt_secret_from_step_1>
```

Save and exit (Ctrl+X, Y, Enter).

### 4. Set Secure File Permissions

```bash
# Set restrictive permissions (readable only by owner)
sudo chmod 600 /var/www/openworld-api/.env.prod

# Set ownership to the application user
sudo chown $USER:$USER /var/www/openworld-api/.env.prod

# Verify permissions (should show -rw-------)
ls -la /var/www/openworld-api/.env.prod
```

### 5. Deploy the New Code

Use the deployment script (builds in `~/work/openworld-api`, deploys to `/var/www/openworld-api`):

```bash
~/work/openworld-api/deployment/deploy.sh
```

### 6. Restart the Application

```bash
pm2 restart openworld-api

# Monitor logs for successful startup
pm2 logs openworld-api --lines 50
```

### 7. Verify the Migration

Run these checks to ensure everything is working:

```bash
# Check application is running
pm2 status

# Test database connection (check logs for connection success)
pm2 logs openworld-api | grep -i "database\|mysql"

# Test authentication endpoint
curl -X POST https://openworld.heimerman.org/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

**Verification Checklist**:
- [ ] Application starts without errors
- [ ] No "missing environment variable" errors in logs
- [ ] Database connection successful
- [ ] Authentication endpoints work
- [ ] JWT tokens are generated correctly
- [ ] Old credentials are NOT in use

### 8. Security Verification

```bash
# Verify .env.prod has correct permissions
ls -la /var/www/openworld-api/.env.prod
# Should show: -rw------- 1 <user> <group>

# Verify .env.prod is not in git
cd /var/www/openworld-api
git ls-files | grep .env.prod
# Should return nothing

# Verify .gitignore protects production env files
grep "\.env\.prod" .gitignore
# Should show: *.env.prod, config/.env.prod, /var/www/openworld-api/.env.prod
```

---

## Troubleshooting

### Application Won't Start

Check logs for specific error:
```bash
pm2 logs openworld-api --lines 100
```

Common issues:
- **"Missing required environment variable"**: Check that all variables are in `.env.prod`
- **"ENOENT: no such file"**: Verify `.env.prod` file exists at `/var/www/openworld-api/.env.prod`
- **"EACCES: permission denied"**: Check file permissions with `ls -la /var/www/openworld-api/.env.prod`

### Database Connection Fails

```bash
# Test MySQL connection manually
mysql -u openworld -p -h localhost openworld
# Use the password from .env.prod

# If connection fails, verify:
# 1. MySQL password was updated in Step 2
# 2. DB_PASSWORD in .env.prod matches the MySQL password
# 3. MySQL is running: sudo systemctl status mysql
```

### Authentication Not Working

```bash
# Check JWT_SECRET is loaded
pm2 logs openworld-api | grep -i "jwt\|secret"

# Verify JWT_SECRET in .env.prod is at least 32 characters
cat /var/www/openworld-api/.env.prod | grep JWT_SECRET
```

---

## Post-Migration

After successful migration:

1. **Document the migration**: Note the date and that credentials were rotated
2. **Store credentials securely**: Ensure new credentials are in password manager
3. **Monitor for issues**: Watch logs for the next 24-48 hours
4. **Delete this guide reference**: This is a one-time process - future deployments use the standard deployment guide

---

## Next Steps

For future deployments and maintenance, refer to:
- **Regular deployments**: `deployment/DEPLOYMENT_GUIDE.md`
- **Daily operations**: `deployment/MAINTENANCE.md`
- **Credential rotation**: See "Credential Rotation" section in `DEPLOYMENT_GUIDE.md`

---

**This is a one-time migration guide. Once completed, you won't need to follow these steps again.**
