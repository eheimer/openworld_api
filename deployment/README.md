# Deployment Documentation

## Document Guide

### For First-Time Deployment

1. **`DEPLOYMENT_GUIDE.md`** - Complete deployment instructions from scratch
   - Setting up the server
   - Installing dependencies
   - Configuring environment variables
   - Setting up SSL
   - Starting the application

2. **`CREDENTIAL_MIGRATION.md`** - One-time migration guide
   - **Use this if**: You're deploying after the environment variable migration commit
   - Rotating previously exposed credentials
   - Creating the production `.env.prod` file
   - **After completing this once, you won't need it again**

### For Ongoing Operations

3. **`MAINTENANCE.md`** - Daily operations and troubleshooting
   - Quick reference for common tasks
   - Restarting the application
   - Viewing logs
   - Database operations
   - Troubleshooting common issues

### Configuration Files

4. **`.env.prod.example`** - Production environment template
   - Template for creating `/opt/openworld-api/.env.prod`
   - Contains placeholder values (NOT actual credentials)
   - Includes instructions for generating secure secrets

### Scripts

5. **`deploy.sh`** - Automated deployment script
6. **`backup-db.sh`** - Database backup script
7. **`ecosystem.config.js`** - PM2 process configuration

### Server Configuration

8. **`apache-openworld.conf`** - Apache reverse proxy configuration
9. **`openworld-api.service`** - Systemd service file (if needed)

## Quick Navigation

**I need to...**

- **Deploy for the first time** → Start with `DEPLOYMENT_GUIDE.md`
- **Migrate from hardcoded credentials** → Follow `CREDENTIAL_MIGRATION.md` (one-time)
- **Deploy an update** → See "Deploying Updates" in `MAINTENANCE.md`
- **Restart the application** → See `MAINTENANCE.md`
- **Troubleshoot an issue** → See "Troubleshooting" in `MAINTENANCE.md`
- **Rotate credentials** → See "Credential Rotation" in `DEPLOYMENT_GUIDE.md`
- **Set up environment variables** → See Step 5 in `DEPLOYMENT_GUIDE.md`
- **Create production .env file** → Use `.env.prod.example` as template

## Document Relationships

```
First-Time Setup:
  DEPLOYMENT_GUIDE.md (Steps 1-10)
    ↓
  CREDENTIAL_MIGRATION.md (if migrating from hardcoded credentials)
    ↓
  Application Running

Ongoing Operations:
  MAINTENANCE.md (daily tasks, updates, troubleshooting)
    ↓
  DEPLOYMENT_GUIDE.md (reference for credential rotation)
```

## Important Notes

- **Never commit** `/opt/openworld-api/.env.prod` to version control
- **Always use** `.env.prod.example` as a template, never as actual configuration
- **Rotate credentials** if they're ever exposed or suspected compromised
- **Keep backups** of your production `.env.prod` file in a secure location
