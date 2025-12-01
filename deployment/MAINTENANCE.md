# Openworld API - Maintenance Quick Reference

## Daily Operations

### Check Application Status
```bash
pm2 status
pm2 logs openworld-api --lines 50
```

### Restart Application
```bash
pm2 restart openworld-api
```

### View Live Logs
```bash
pm2 logs openworld-api
# Press Ctrl+C to exit
```

### Monitor Resources
```bash
pm2 monit
# Shows CPU/Memory usage in real-time
```

## Deploying Updates

### Quick Deploy (using script)
```bash
cd /var/www/openworld-api
./deployment/deploy.sh
```

### Manual Deploy
```bash
cd /var/www/openworld-api
git pull
npm ci --production
npm run build
NODE_ENV=prod npm run migration:run
pm2 restart openworld-api
```

## Database Operations

### Backup Database
```bash
# Manual backup
mysqldump -u openworld -p openworld > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use the script
cd /var/www/openworld-api
./deployment/backup-db.sh
```

### Restore Database
```bash
mysql -u openworld -p openworld < backup_file.sql
```

### Run Migrations
```bash
cd /var/www/openworld-api
NODE_ENV=prod npm run migration:run
```

### Access MySQL Console
```bash
mysql -u openworld -p openworld
```

## Apache Operations

### Restart Apache
```bash
sudo systemctl restart apache2
```

### Reload Apache Config (no downtime)
```bash
sudo systemctl reload apache2
```

### Test Apache Config
```bash
sudo apache2ctl configtest
```

### View Apache Logs
```bash
# Error logs
sudo tail -f /var/log/apache2/openworld-ssl-error.log

# Access logs
sudo tail -f /var/log/apache2/openworld-ssl-access.log
```

## SSL Certificate

### Check Certificate Status
```bash
sudo certbot certificates
```

### Renew Certificate (manual)
```bash
sudo certbot renew
```

### Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### App Not Responding
```bash
# Check if app is running
pm2 status

# Check logs for errors
pm2 logs openworld-api --lines 100

# Restart if needed
pm2 restart openworld-api
```

### 502 Bad Gateway
```bash
# Check if Node app is listening
curl http://localhost:3000

# If not responding, check PM2
pm2 status
pm2 logs openworld-api

# Restart
pm2 restart openworld-api
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u openworld -p -h localhost openworld

# Check MySQL is running
sudo systemctl status mysql

# Restart MySQL if needed
sudo systemctl restart mysql
```

### High Memory/CPU Usage
```bash
# Check resource usage
pm2 monit

# Or use system tools
htop
# or
top
```

### Port 3000 Already in Use
```bash
# Find what's using port 3000
sudo netstat -tlnp | grep 3000

# Or
sudo lsof -i :3000

# Kill the process if needed
sudo kill -9 <PID>
```

## File Locations

- **Application**: `/var/www/openworld-api`
- **Logs**: `/var/log/openworld-api/`
- **Apache Config**: `/etc/apache2/sites-available/openworld.conf`
- **SSL Certs**: `/etc/letsencrypt/live/openworld.heimerman.org/`
- **PM2 Config**: `~/.pm2/`
- **Database Config**: `/var/www/openworld-api/ormconfig.ts`

## Important Files to Backup

1. Database (use backup script)
2. `/var/www/openworld-api/ormconfig.ts` (contains DB password)
3. `/etc/apache2/sites-available/openworld.conf` (Apache config)
4. SSL certificates (auto-backed up by certbot)

## Scheduled Maintenance

### Weekly
- Check application logs for errors
- Verify SSL certificate expiry date
- Review disk space usage

### Monthly
- Update system packages: `sudo apt-get update && sudo apt-get upgrade`
- Review and clean old log files
- Test database backup/restore process

### Before Going Live
- Move secrets to environment variables (see GitHub issue)
- Set up automated database backups (cron job)
- Configure monitoring/alerting
- Review security settings

## Emergency Contacts

- Application logs: `pm2 logs openworld-api`
- Apache logs: `/var/log/apache2/openworld-*.log`
- MySQL logs: `/var/log/mysql/error.log`
- System logs: `sudo journalctl -xe`

## Quick Health Check

```bash
# One-liner to check everything
pm2 status && \
curl -I http://localhost:3000 && \
curl -I https://openworld.heimerman.org && \
sudo systemctl status apache2 --no-pager && \
sudo systemctl status mysql --no-pager
```
