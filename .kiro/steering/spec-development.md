# Spec Development Guidelines

## Overview

Specs are structured feature development plans that include requirements, design, and implementation tasks. This document provides guidelines for maintaining clean spec directories during development.

## Directory Structure

Each spec should follow this structure:

```
.kiro/specs/{feature-name}/
├── requirements.md       # Feature requirements (tracked in git)
├── design.md            # Design document (tracked in git)
├── tasks.md             # Implementation tasks (tracked in git)
└── DOCUMENTATION/       # Temporary notes (ignored by git)
    ├── verification/
    ├── summaries/
    └── notes/
```

## Temporary Documentation

During spec implementation, you may create temporary documentation files for:
- Task verification reports
- Implementation summaries
- Manual testing guides
- Implementation notes
- Debugging documentation

**IMPORTANT:** All temporary documentation MUST be placed in the `DOCUMENTATION/` directory within the spec folder.

### Rules for Temporary Documentation

1. **Always use the DOCUMENTATION directory**
   - Create `.kiro/specs/{feature-name}/DOCUMENTATION/` if it doesn't exist
   - Place ALL temporary files in this directory or its subdirectories

2. **Organize by purpose** (optional subdirectories):
   - `DOCUMENTATION/verification/` - Task verification reports
   - `DOCUMENTATION/summaries/` - Task summaries
   - `DOCUMENTATION/notes/` - Implementation notes
   - `DOCUMENTATION/testing/` - Manual test guides

3. **Never commit temporary documentation**
   - The `DOCUMENTATION/` directory is ignored by git
   - These files are for development reference only
   - Important information should be added to the spec documents (requirements.md, design.md, tasks.md)

### Example File Placement

❌ **WRONG:**
```
client-src/VERIFICATION.md
client-src/TASK_10_SUMMARY.md
client-src/API_SERVICE_IMPLEMENTATION.md
```

✅ **CORRECT:**
```
.kiro/specs/test-client/DOCUMENTATION/verification/task-10-verification.md
.kiro/specs/test-client/DOCUMENTATION/summaries/task-10-summary.md
.kiro/specs/test-client/DOCUMENTATION/notes/api-service-implementation.md
```

## Benefits

This approach provides:
- **Clean git history** - No temporary files cluttering commits
- **Organized documentation** - Easy to find development notes
- **Simple cleanup** - Delete entire DOCUMENTATION directory when done
- **Consistent structure** - All specs follow the same pattern
- **No .gitignore maintenance** - One pattern covers all specs

## Migration

If you find temporary documentation files outside the DOCUMENTATION directory:
1. Create the DOCUMENTATION directory if needed
2. Move the files into appropriate subdirectories
3. Update any references to the files
4. The files will be automatically ignored by git
