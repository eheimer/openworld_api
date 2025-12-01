# NocoDB Admin Panel Setup

NocoDB provides a spreadsheet-like interface for managing your database with excellent support for relationships.

## Why NocoDB?

✅ **Relationship Management** - Easily manage Monster → MonsterActions, Monster → DamageTypes, etc.
✅ **Non-Technical Friendly** - Spreadsheet interface anyone can use
✅ **DML-Only** - Users can't modify schema without admin permissions
✅ **Self-Hosted** - No external dependencies
✅ **Direct Database Connection** - No data duplication

## Quick Start

### 1. Start NocoDB

```bash
# Using Docker Compose (recommended)
docker-compose -f docker-compose.admin.yml up -d

# Or using Docker directly
docker run -d \
  --name openworld-admin \
  -p 8080:8080 \
  -v nocodb_data:/usr/app/data \
  nocodb/nocodb:latest
```

### 2. Access NocoDB

Open your browser to: http://localhost:8080

**First time setup:**
1. Create an admin account (email + password)
2. You'll see the NocoDB dashboard

### 3. Connect to Your Database

#### For Development (SQLite):

1. Click **"New Project"**
2. Select **"Connect to External Database"**
3. Choose **"SQLite"**
4. Configure:
   - **Database File Path**: `/path/to/your/dev.sqlite`
   - Or use absolute path: `/mnt/bigguy/work/openworld/openworld_api/dev.sqlite`
5. Click **"Test Connection"** then **"Submit"**

#### For Production (MySQL):

1. Click **"New Project"**
2. Select **"Connect to External Database"**
3. Choose **"MySQL"**
4. Configure:
   - **Host**: `localhost` (or your MySQL host)
   - **Port**: `3306`
   - **Database**: `openworld`
   - **Username**: `openworld`
   - **Password**: `entranced`
5. Click **"Test Connection"** then **"Submit"**

### 4. Your Tables Appear

All your tables will now appear as spreadsheets:
- Players
- Games
- Characters
- Monsters
- MonsterActions
- Conditions
- DamageTypes
- Skills
- Races
- Items
- etc.

## Managing Relationships

### One-to-Many (Monster → MonsterActions)

**Viewing:**
1. Open the **Monsters** table
2. Click on any Monster row to expand
3. Scroll to the **Actions** column
4. Click to see all related MonsterActions

**Adding Actions:**
1. In the expanded Monster view
2. Click **"+ Add Action"** in the Actions section
3. Choose:
   - **"Link to existing record"** - Select from existing actions
   - **"Create new record"** - Create a new action inline
4. Fill in the action details
5. Save - it's automatically linked to the monster

**Removing Actions:**
1. In the Actions list for a Monster
2. Click the **"x"** next to an action
3. Confirms unlink (doesn't delete the action, just unlinks it)

### Many-to-One (Monster → DamageType)

**Editing:**
1. Open a Monster record
2. Find the **Damage Type** column
3. Click the dropdown
4. Select from available DamageTypes
5. Auto-saves

### Many-to-Many (Monster → SlayerTypes)

**Managing:**
1. Open a Monster record
2. Find the **Slayers** column
3. Click to expand
4. Check/uncheck slayer types
5. Or click **"+ Link"** to add more
6. Auto-saves

## User Management

### Creating Users

1. Click **Settings** (gear icon)
2. Go to **"Team & Auth"**
3. Click **"Invite Team Member"**
4. Enter email address
5. Choose role:
   - **Creator**: Can modify schema (admin only)
   - **Editor**: Can edit data (for your admin users)
   - **Commenter**: Can only comment
   - **Viewer**: Read-only

### Recommended Setup

**For Admin Users (non-developers):**
- Role: **Editor**
- Permissions: Can edit all tables
- Cannot modify schema/structure

**For Developers:**
- Role: **Creator**
- Full access including schema changes

## Table-Level Permissions

You can restrict access per table:

1. Open a table
2. Click **"..."** menu → **"Table Settings"**
3. Go to **"Permissions"**
4. Set permissions per role:
   - ✅ View
   - ✅ Create
   - ✅ Update
   - ✅ Delete

Example: Restrict Players table to view-only for editors.

## Views and Filters

### Creating Views

Users can create custom views without affecting others:

1. Click **"+ Create View"**
2. Choose type:
   - **Grid**: Spreadsheet view
   - **Gallery**: Card view
   - **Form**: Data entry form
   - **Kanban**: Board view
3. Name it (e.g., "Active Monsters", "High-Level Characters")
4. Apply filters, sorts, hide columns

### Example: "Dragons Only" View

1. In Monsters table
2. Create new Grid view: "Dragons"
3. Add filter: `name` contains `dragon`
4. Hide unnecessary columns
5. Save - now you have a Dragons-only view

## Best Practices

### 1. Use Read-Only Database User (Production)

For safety, create a read-only user for viewing:

```sql
CREATE USER 'nocodb_readonly'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT ON openworld.* TO 'nocodb_readonly'@'%';
FLUSH PRIVILEGES;
```

Then create two projects in NocoDB:
- **"Openworld (View Only)"** - Uses readonly user
- **"Openworld (Admin)"** - Uses full access user

### 2. Regular Backups

NocoDB doesn't change your data structure, but always backup before bulk edits:

```bash
# MySQL backup
mysqldump -u openworld -p openworld > backup_$(date +%Y%m%d).sql

# SQLite backup
cp dev.sqlite dev.sqlite.backup_$(date +%Y%m%d)
```

### 3. Test in Development First

Always test changes in your dev.sqlite database before touching production.

### 4. Use Audit Log

NocoDB tracks all changes. To view:
1. Click **Settings** → **"Audit"**
2. See who changed what and when

## Common Tasks

### Adding a New Monster

1. Open **Monsters** table
2. Click **"+ Add New Row"**
3. Fill in monster details
4. In **Actions** column, click **"+ Add"**
5. Create or link actions
6. In **Damage Type**, select from dropdown
7. In **Slayers**, check applicable slayer types
8. Save

### Bulk Editing

1. Select multiple rows (checkbox on left)
2. Right-click → **"Bulk Update"**
3. Choose field to update
4. Enter new value
5. Apply to all selected

### Importing Data

1. Click **"..."** menu → **"Import"**
2. Choose CSV/Excel file
3. Map columns
4. Import

### Exporting Data

1. Click **"..."** menu → **"Export"**
2. Choose format (CSV/Excel)
3. Download

## Troubleshooting

### Can't Connect to Database

**SQLite:**
- Ensure the file path is absolute
- Check file permissions (NocoDB needs read/write)
- If in Docker, mount the SQLite file as a volume

**MySQL:**
- Verify MySQL is running: `mysql -u openworld -p`
- Check firewall allows port 3306
- Ensure user has proper permissions

### Relationships Not Showing

- NocoDB detects relationships from foreign keys
- Ensure your TypeORM entities have proper decorators
- Run migrations to ensure FKs exist in database
- Refresh the project in NocoDB

### Performance Issues

- Add indexes to frequently queried columns
- Limit the number of rows displayed (use pagination)
- Use views with filters instead of loading entire tables

## Stopping NocoDB

```bash
# If using Docker Compose
docker-compose -f docker-compose.admin.yml down

# If using Docker directly
docker stop openworld-admin
```

## Updating NocoDB

```bash
# Pull latest image
docker pull nocodb/nocodb:latest

# Restart container
docker-compose -f docker-compose.admin.yml down
docker-compose -f docker-compose.admin.yml up -d
```

Your data is preserved in the `nocodb_data` volume.

## Alternative: Directus

If you want a more polished UI with better permissions, consider Directus:

```bash
docker run -d \
  --name openworld-directus \
  -p 8055:8055 \
  -e KEY=replace-with-random-string \
  -e SECRET=replace-with-random-string \
  -e DB_CLIENT=mysql \
  -e DB_HOST=localhost \
  -e DB_PORT=3306 \
  -e DB_DATABASE=openworld \
  -e DB_USER=openworld \
  -e DB_PASSWORD=entranced \
  -e ADMIN_EMAIL=admin@example.com \
  -e ADMIN_PASSWORD=changeme \
  directus/directus:latest
```

Access at: http://localhost:8055

Directus has a more "admin panel" feel vs NocoDB's "spreadsheet" feel.

## Support

- NocoDB Docs: https://docs.nocodb.com
- GitHub Issues: https://github.com/nocodb/nocodb/issues
- Discord: https://discord.gg/5RgZmkW
