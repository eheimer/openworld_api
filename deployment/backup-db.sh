#!/bin/bash
# Database backup script
# Add to crontab for automated backups: 0 2 * * * /var/www/openworld-api/deployment/backup-db.sh

BACKUP_DIR="/var/backups/openworld-api"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="openworld"
DB_USER="openworld"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/openworld_$TIMESTAMP.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "openworld_*.sql.gz" -mtime +30 -delete

echo "Backup completed: openworld_$TIMESTAMP.sql.gz"
