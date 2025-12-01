# Pre-Commit Security Checklist

Quick verification before committing environment variable changes.

## ✅ Security Checks

- [ ] No actual production credentials in any files
- [ ] `.env.prod.example` contains only PLACEHOLDER values
- [ ] `config/.env.dev` and `config/.env.test` contain only non-production defaults
- [ ] Source files (`src/constants.ts`, `ormconfig.ts`) use environment variables
- [ ] `.gitignore` includes `*.env.prod`, `config/.env.prod`, `/opt/openworld-api/.env.prod`

## Verification Commands

```bash
# Check what will be committed
git status
git diff

# Verify .env.prod files are ignored
git check-ignore -v config/.env.prod deployment/.env.prod test.env.prod

# Verify .env.prod.example is NOT ignored
git check-ignore deployment/.env.prod.example
# (should return nothing)

# Search for old credentials (should only appear in comments/docs)
grep -r "entranced\|secretKey" --include="*.ts" --include="*.js" src/
```

## Safe to Commit When

- No actual credentials in committed files
- Only placeholder values in `.env.prod.example`
- Production `.env.prod` files are gitignored
- Old credentials only mentioned in documentation (explaining what NOT to use)

## After Commit

For first-time deployment with these changes, see `deployment/CREDENTIAL_MIGRATION.md`.
