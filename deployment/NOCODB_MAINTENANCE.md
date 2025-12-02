# NocoDB Admin Interface - Maintenance Quick Reference

This guide provides quick reference commands for maintaining the NocoDB admin interface in production. For detailed deployment instructions, see `NOCODB_DEPLOYMENT.md`.

## Daily Operations

### Check NocoDB Status

```bash
# Check systemd service status
sudo systemctl status nocodb

# Check Docker container status
docker ps | grep nocodb

# View recent logs
docker logs openworld-nocodb --tail 50

# Check if accessible locally
curl -I http://localhost:8080

# Check if accessible via HTTPS
curl -I https://openworld.heimerman.org/admin
```

### View Logs

```bash
# View Docker container logs
docker logs openworld-nocodb --tail 100

# Follow logs in real-time
docker logs -f openworld-nocodb

# View systemd service logs
sudo journalctl -u nocodb -n 100

# Follow systemd logs in real-time
sudo journalctl -u nocodb -f

# View Apache logs for /admin requests
sudo tail -f /var/log/apache2/openworld-ssl-access.log | grep "/admin"
sudo tail -f /var/log/apache2/openworld-ssl-error.log | grep "/admin"
```

### Restart NocoDB

```bash
# Restart via systemd (recommended)
sudo systemctl restart nocodb

# Or restart container directly
docker restart openworld-nocodb

# Verify it's running
docker ps | grep nocodb
docker logs openworld-nocodb --tail 20
```

### Stop and Start

```bash
# Stop NocoDB
sudo systemctl stop nocodb

# Start NocoDB
sudo systemctl start nocodb

# Check status
sudo systemctl status nocodb
```

## Update Procedures

### Update NocoDB to Latest Version

```bash
# 1. Backup current NocoDB data (recommended)
mkdir -p ~/backups/nocodb
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# 2. Pull latest NocoDB image
docker pull nocodb/nocodb:latest

# 3. Restart service (will use new image)
sudo systemctl restart nocodb

# 4. Wait for startup (10-15 seconds)
sleep 15

# 5. Verify new version is running
docker logs openworld-nocodb | head -20

# 6. Test access
curl -I https://openworld.heimerman.org/admin

# 7. Log in and verify functionality
```

**Note:** Check [NocoDB release notes](https://github.com/nocodb/nocodb/releases) before updating for breaking changes.

### Update to Specific Version

```bash
# 1. Backup current data
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# 2. Stop NocoDB
sudo systemctl stop nocodb

# 3. Edit docker-compose.nocodb.yml to specify version
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml
# Change: image: nocodb/nocodb:0.X.Y

# 4. Start NocoDB
sudo systemctl start nocodb

# 5. Verify version
docker logs openworld-nocodb | head -20
```

## Backup Procedures

### Backup NocoDB Metadata

NocoDB stores its own data (user accounts, views, settings) in a Docker volume:

```bash
# Create backup directory
mkdir -p ~/backups/nocodb

# Backup NocoDB metadata volume
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# Verify backup was created
ls -lh ~/backups/nocodb/

# Check backup size
du -h ~/backups/nocodb/nocodb_data_*.tar.gz
```

### Restore NocoDB Metadata

```bash
# 1. Stop NocoDB
sudo systemctl stop nocodb

# 2. List available backups
ls -lh ~/backups/nocodb/

# 3. Restore from backup (replace YYYYMMDD_HHMMSS with your backup timestamp)
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/nocodb_data_YYYYMMDD_HHMMSS.tar.gz"

# 4. Start NocoDB
sudo systemctl start nocodb

# 5. Verify restoration
docker logs openworld-nocodb --tail 50
curl -I https://openworld.heimerman.org/admin

# 6. Log in and verify users/views are restored
```

### Backup Database (Game Data)

The MySQL database contains the actual game data. NocoDB only provides an interface to view/edit it.

```bash
# Manual database backup
mysqldump -u openworld -p openworld > ~/backups/openworld_$(date +%Y%m%d_%H%M%S).sql

# Or use the backup script
/var/www/openworld-api/deployment/backup-db.sh

# Verify backup
ls -lh ~/backups/openworld_*.sql
```

**Important:** Always backup the database before making bulk changes through NocoDB.

### Restore Database

```bash
# 1. Stop services to prevent changes during restore
sudo systemctl stop nocodb
pm2 stop openworld-api

# 2. Restore database (replace filename with your backup)
mysql -u openworld -p openworld < ~/backups/openworld_YYYYMMDD_HHMMSS.sql

# 3. Verify restoration
mysql -u openworld -p -e "USE openworld; SELECT COUNT(*) FROM players;"

# 4. Restart services
pm2 start openworld-api
sudo systemctl start nocodb
```

## Health Check Commands

### Quick Health Check

```bash
# One-liner to check everything
docker ps | grep nocodb && \
curl -I http://localhost:8080 && \
curl -I https://openworld.heimerman.org/admin && \
sudo systemctl status nocodb --no-pager
```

### Detailed Health Check

```bash
# 1. Check Docker container
echo "=== Docker Container Status ==="
docker ps | grep nocodb

# 2. Check systemd service
echo "=== Systemd Service Status ==="
sudo systemctl status nocodb --no-pager

# 3. Check local access
echo "=== Local Access Test ==="
curl -I http://localhost:8080

# 4. Check HTTPS access
echo "=== HTTPS Access Test ==="
curl -I https://openworld.heimerman.org/admin

# 5. Check MySQL connection
echo "=== MySQL Connection Test ==="
mysql -u openworld -p -e "SELECT 1;" openworld

# 6. Check recent logs for errors
echo "=== Recent Errors ==="
docker logs openworld-nocodb --tail 50 | grep -i error

# 7. Check resource usage
echo "=== Resource Usage ==="
docker stats openworld-nocodb --no-stream
```

### API Health Check

```bash
# NocoDB health endpoint
curl http://localhost:8080/api/v1/health

# Expected response: {"uptime":X,"message":"OK","timestamp":X}
```

## Monitoring

### Resource Monitoring

```bash
# Monitor container resources in real-time
docker stats openworld-nocodb

# Check disk usage of Docker volumes
docker system df -v | grep nocodb

# Check memory usage
free -h

# Check disk space
df -h /var/lib/docker
```

### Log Monitoring

```bash
# Watch for errors in real-time
docker logs -f openworld-nocodb | grep -i error

# Watch systemd logs
sudo journalctl -u nocodb -f

# Watch Apache logs for /admin requests
sudo tail -f /var/log/apache2/openworld-ssl-access.log | grep "/admin"
```

### Automated Monitoring Script

Create a monitoring script at `~/monitor-nocodb.sh`:

```bash
#!/bin/bash
# NocoDB Health Monitoring Script

echo "=== NocoDB Health Check - $(date) ==="

# Check if container is running
if docker ps | grep -q openworld-nocodb; then
    echo "✓ Container is running"
else
    echo "✗ Container is NOT running"
    exit 1
fi

# Check if service is active
if systemctl is-active --quiet nocodb; then
    echo "✓ Systemd service is active"
else
    echo "✗ Systemd service is NOT active"
    exit 1
fi

# Check local access
if curl -f -s http://localhost:8080/api/v1/health > /dev/null; then
    echo "✓ Local access working"
else
    echo "✗ Local access FAILED"
    exit 1
fi

# Check HTTPS access
if curl -f -s https://openworld.heimerman.org/admin > /dev/null; then
    echo "✓ HTTPS access working"
else
    echo "✗ HTTPS access FAILED"
    exit 1
fi

echo "=== All checks passed ==="
```

Make it executable and run:

```bash
chmod +x ~/monitor-nocodb.sh
~/monitor-nocodb.sh
```

## Troubleshooting

### Container Not Running

```bash
# Check why container stopped
docker ps -a | grep nocodb
docker logs openworld-nocodb --tail 100

# Check systemd logs
sudo journalctl -u nocodb -n 50

# Restart service
sudo systemctl restart nocodb

# If still failing, check for port conflicts
sudo netstat -tlnp | grep 8080
```

### 502 Bad Gateway

```bash
# Check if container is running
docker ps | grep nocodb

# Check if NocoDB is responding locally
curl -I http://localhost:8080

# Check Apache logs
sudo tail -f /var/log/apache2/openworld-ssl-error.log

# Restart NocoDB
sudo systemctl restart nocodb

# Restart Apache if needed
sudo systemctl reload apache2
```

### Database Connection Failed

```bash
# Test MySQL connection
mysql -u openworld -p -h localhost openworld

# Check MySQL is running
sudo systemctl status mysql

# Verify database credentials
grep "^DB_" /var/www/openworld-api/.env.prod

# Check NocoDB logs for connection errors
docker logs openworld-nocodb | grep -i "database\|mysql\|connection"

# Restart MySQL if needed
sudo systemctl restart mysql
```

### Slow Performance

```bash
# Check resource usage
docker stats openworld-nocodb --no-stream

# Check system resources
free -h
df -h

# Check for errors in logs
docker logs openworld-nocodb --tail 100 | grep -i "error\|warning"

# Restart container to free resources
sudo systemctl restart nocodb
```

### Container Keeps Restarting

```bash
# Check container logs for errors
docker logs openworld-nocodb --tail 200

# Check for port conflicts
sudo netstat -tlnp | grep 8080

# Check systemd logs
sudo journalctl -u nocodb -n 100

# Stop the restart loop
sudo systemctl stop nocodb

# Fix the issue, then start again
sudo systemctl start nocodb
```

### Can't Access Admin Interface

```bash
# 1. Check if container is running
docker ps | grep nocodb

# 2. Test local access
curl -I http://localhost:8080

# 3. Test HTTPS access
curl -I https://openworld.heimerman.org/admin

# 4. Check Apache configuration
sudo apache2ctl configtest
sudo apache2ctl -t -D DUMP_VHOSTS | grep -A 10 openworld

# 5. Check Apache logs
sudo tail -f /var/log/apache2/openworld-ssl-error.log

# 6. Restart services
sudo systemctl restart nocodb
sudo systemctl reload apache2
```

### Blank Page or JavaScript Errors

```bash
# Check NC_PUBLIC_URL environment variable
docker exec openworld-nocodb env | grep NC_PUBLIC_URL
# Should be: NC_PUBLIC_URL=https://openworld.heimerman.org/admin

# If wrong, fix docker-compose.nocodb.yml
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml

# Restart container
sudo systemctl restart nocodb

# Clear browser cache and try again
```

## Configuration Changes

### Update Environment Variables

```bash
# Edit Docker Compose configuration
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml

# Restart to apply changes
sudo systemctl restart nocodb

# Verify new configuration
docker exec openworld-nocodb env | grep "^NC_"
```

### Change NocoDB Port

```bash
# 1. Edit docker-compose.nocodb.yml
sudo nano /var/www/openworld-api/deployment/docker-compose.nocodb.yml
# Change: ports: "127.0.0.1:8081:8080"

# 2. Update Apache configuration
sudo nano /etc/apache2/sites-available/openworld.conf
# Change: ProxyPass /admin http://localhost:8081/admin
# Change: ProxyPassReverse /admin http://localhost:8081/admin

# 3. Test Apache configuration
sudo apache2ctl configtest

# 4. Restart services
sudo systemctl restart nocodb
sudo systemctl reload apache2

# 5. Verify access
curl -I http://localhost:8081
curl -I https://openworld.heimerman.org/admin
```

## Security Maintenance

### Review Audit Logs

```bash
# Access audit logs via NocoDB UI:
# 1. Log in to https://openworld.heimerman.org/admin
# 2. Go to Settings → Audit
# 3. Review recent changes

# Or check Docker logs for access patterns
docker logs openworld-nocodb | grep -i "request\|access"
```

### Update Admin Password

```bash
# Update via NocoDB UI:
# 1. Log in to https://openworld.heimerman.org/admin
# 2. Go to Account Settings
# 3. Change password

# Or reset via database (if locked out):
# This requires direct database access to NocoDB's SQLite database
```

### Verify Security Settings

```bash
# 1. Check port is not exposed to internet
sudo netstat -tlnp | grep 8080
# Should only show 127.0.0.1:8080 (localhost)

# 2. Check environment file permissions
ls -la /var/www/openworld-api/.env.prod
# Should show -rw------- (600 permissions)

# 3. Check SSL certificate
sudo certbot certificates

# 4. Test HTTPS access
curl -I https://openworld.heimerman.org/admin | grep -i "ssl\|certificate"
```

## Scheduled Maintenance

### Weekly Tasks

```bash
# 1. Check container status
docker ps | grep nocodb

# 2. Review logs for errors
docker logs openworld-nocodb --tail 100 | grep -i error

# 3. Verify admin access
curl -I https://openworld.heimerman.org/admin

# 4. Check disk usage
docker system df -v | grep nocodb
```

### Monthly Tasks

```bash
# 1. Update NocoDB to latest version
docker pull nocodb/nocodb:latest
sudo systemctl restart nocodb

# 2. Backup NocoDB metadata
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_data_$(date +%Y%m%d).tar.gz -C /data .

# 3. Review audit logs (via UI)
# Log in and check Settings → Audit

# 4. Clean up old backups (keep last 3 months)
find ~/backups/nocodb/ -name "nocodb_data_*.tar.gz" -mtime +90 -delete

# 5. Check resource usage trends
docker stats openworld-nocodb --no-stream
```

### Quarterly Tasks

```bash
# 1. Review and update documentation
# Check if any procedures have changed

# 2. Test backup and restore procedure
# Verify backups can be restored successfully

# 3. Review NocoDB user accounts
# Remove inactive users via UI

# 4. Check for NocoDB security updates
# Visit: https://github.com/nocodb/nocodb/security/advisories

# 5. Review Apache and SSL configuration
sudo apache2ctl configtest
sudo certbot certificates
```

## File Locations

### Configuration Files

| File | Purpose |
|------|---------|
| `/var/www/openworld-api/deployment/docker-compose.nocodb.yml` | Docker Compose configuration |
| `/etc/systemd/system/nocodb.service` | Systemd service definition |
| `/etc/apache2/sites-available/openworld.conf` | Apache reverse proxy configuration |
| `/var/www/openworld-api/.env.prod` | Database credentials (for connection) |

### Data Locations

| Location | Contents |
|----------|----------|
| `/var/lib/docker/volumes/nocodb_data/` | NocoDB metadata (users, views, settings) |
| Docker volume `nocodb_data` | Persistent NocoDB data |
| `~/backups/nocodb/` | NocoDB metadata backups |
| `~/backups/` | Database backups |

### Log Locations

| Log Type | Location/Command |
|----------|------------------|
| NocoDB Container | `docker logs openworld-nocodb` |
| Systemd Service | `sudo journalctl -u nocodb` |
| Apache Access | `/var/log/apache2/openworld-ssl-access.log` |
| Apache Error | `/var/log/apache2/openworld-ssl-error.log` |
| MySQL Error | `/var/log/mysql/error.log` |

## Common Commands Reference

### Service Management

```bash
sudo systemctl start nocodb      # Start NocoDB
sudo systemctl stop nocodb       # Stop NocoDB
sudo systemctl restart nocodb    # Restart NocoDB
sudo systemctl status nocodb     # Check status
sudo systemctl enable nocodb     # Enable auto-start on boot
sudo systemctl disable nocodb    # Disable auto-start
```

### Docker Commands

```bash
docker ps | grep nocodb                    # Check if container is running
docker ps -a | grep nocodb                 # Show container (even if stopped)
docker logs openworld-nocodb               # View logs
docker logs -f openworld-nocodb            # Follow logs
docker restart openworld-nocodb            # Restart container
docker stop openworld-nocodb               # Stop container
docker start openworld-nocodb              # Start container
docker exec openworld-nocodb <command>     # Run command in container
docker stats openworld-nocodb              # Show resource usage
docker inspect openworld-nocodb            # Show detailed info
```

### Docker Compose Commands

```bash
cd /var/www/openworld-api/deployment

# Start services
docker-compose -f docker-compose.nocodb.yml up -d

# Stop services
docker-compose -f docker-compose.nocodb.yml down

# View logs
docker-compose -f docker-compose.nocodb.yml logs

# Restart services
docker-compose -f docker-compose.nocodb.yml restart

# Pull latest images
docker-compose -f docker-compose.nocodb.yml pull

# Validate configuration
docker-compose -f docker-compose.nocodb.yml config
```

### Apache Commands

```bash
sudo apache2ctl configtest              # Test configuration
sudo systemctl reload apache2           # Reload config (no downtime)
sudo systemctl restart apache2          # Restart Apache
sudo systemctl status apache2           # Check status
sudo apache2ctl -t -D DUMP_VHOSTS       # Show virtual hosts
```

## Emergency Procedures

### Complete Service Restart

```bash
# Restart everything related to NocoDB
sudo systemctl stop nocodb
docker stop openworld-nocodb
docker rm openworld-nocodb
sudo systemctl start nocodb

# Verify
docker ps | grep nocodb
curl -I https://openworld.heimerman.org/admin
```

### Reset NocoDB (Keep Database Connection)

```bash
# WARNING: This deletes NocoDB users and views, but keeps database connection info

# 1. Backup current data
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_emergency_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# 2. Stop NocoDB
sudo systemctl stop nocodb

# 3. Remove NocoDB database
docker run --rm -v nocodb_data:/data alpine rm /data/nocodb.db

# 4. Start NocoDB (creates fresh database)
sudo systemctl start nocodb

# 5. Reconfigure via UI
# - Create new admin user
# - Reconnect to MySQL database
```

### Complete Removal and Reinstall

```bash
# 1. Backup data
docker run --rm \
  -v nocodb_data:/data \
  -v ~/backups/nocodb:/backup \
  alpine tar czf /backup/nocodb_before_removal_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

# 2. Stop and remove everything
sudo systemctl stop nocodb
docker rm -f openworld-nocodb
docker volume rm nocodb_data
docker rmi nocodb/nocodb:latest

# 3. Reinstall
docker pull nocodb/nocodb:latest
docker volume create nocodb_data
sudo systemctl start nocodb

# 4. Reconfigure via UI
```

## Support and Resources

### Documentation

- **This Guide:** Quick reference for maintenance
- **NOCODB_DEPLOYMENT.md:** Detailed deployment and troubleshooting
- **DEPLOYMENT_GUIDE.md:** Main application deployment
- **MAINTENANCE.md:** Main application maintenance
- **NocoDB Docs:** https://docs.nocodb.com/

### Getting Help

1. **Check logs first:**
   ```bash
   docker logs openworld-nocodb --tail 100
   sudo journalctl -u nocodb -n 100
   ```

2. **Review troubleshooting section** in NOCODB_DEPLOYMENT.md

3. **Check NocoDB GitHub issues:** https://github.com/nocodb/nocodb/issues

4. **Check system resources:**
   ```bash
   free -h
   df -h
   docker stats openworld-nocodb --no-stream
   ```

### Quick Diagnostic

```bash
# Run this when something goes wrong
echo "=== NocoDB Diagnostic Report ==="
echo "Date: $(date)"
echo ""
echo "=== Container Status ==="
docker ps -a | grep nocodb
echo ""
echo "=== Service Status ==="
sudo systemctl status nocodb --no-pager
echo ""
echo "=== Recent Logs ==="
docker logs openworld-nocodb --tail 20
echo ""
echo "=== Resource Usage ==="
docker stats openworld-nocodb --no-stream
echo ""
echo "=== Port Status ==="
sudo netstat -tlnp | grep 8080
echo ""
echo "=== Local Access ==="
curl -I http://localhost:8080 2>&1 | head -5
echo ""
echo "=== HTTPS Access ==="
curl -I https://openworld.heimerman.org/admin 2>&1 | head -5
```

## Summary

This maintenance guide covers:

- ✓ Daily operations (status checks, logs, restarts)
- ✓ Update procedures (NocoDB version updates)
- ✓ Backup and restore procedures (metadata and database)
- ✓ Health check commands
- ✓ Monitoring (resources, logs, automated scripts)
- ✓ Troubleshooting (common issues and solutions)
- ✓ Configuration changes
- ✓ Security maintenance
- ✓ Scheduled maintenance tasks
- ✓ File and log locations
- ✓ Command reference
- ✓ Emergency procedures

**For detailed deployment instructions and comprehensive troubleshooting, see `NOCODB_DEPLOYMENT.md`.**

**Access your admin interface:** https://openworld.heimerman.org/admin
