# GitHub Issue Integration

## Issue Reference Detection

When the user references an issue number (e.g., "#42", "issue #42", "issue 42"), you should:

1. **Fetch the issue details** using the GitHub MCP server
   - Repository: `eheimer/openworld_api`
   - Use `mcp_github_get_issue` with the issue number

2. **Check for tasks.md file** in the issue body or comments
   - If the issue contains a tasks.md or task list, use it to track progress

## Issue Progress Tracking

When working on an issue with a task list, follow this workflow:

### 1. First Task Started

When you begin working on the first task:
- Add a comment to the issue using `mcp_github_add_issue_comment`
- **Store the comment ID** for later updates
- Comment should include:
  - Acknowledgment that work has started
  - Complete contents of the tasks.md or task list
  - Format as a GitHub markdown checklist

Example comment:
```
Starting work on this issue. Task progress:

- [ ] Task 1 description
- [ ] Task 2 description
- [ ] Task 3 description
```

### 2. Task Completion

After completing each task:
- **Update the original comment** using `mcp_github_update_issue_comment` (NOT add a new comment)
- Check off the completed task by changing `- [ ]` to `- [x]`
- Keep the same comment structure, just update the checkboxes

Example updated comment:
```
Starting work on this issue. Task progress:

- [x] Task 1 description
- [x] Task 2 description
- [ ] Task 3 description
```

### 3. All Tasks Completed

When the final task is completed:
- Update the comment one last time with all tasks checked
- Ask the user if they want to close the issue
- Wait for user confirmation

### 4. Closing the Issue

If the user confirms (affirmative response like "yes", "sure", "go ahead", etc.):
- Add a brief final comment: "Work completed." or similar
- Use `mcp_github_update_issue` to close the issue with `state: "closed"`

## Best Practices

- Always fetch the issue first to understand context
- Don't spam comments - be concise and meaningful
- Only track progress for issues with clear task lists
- If an issue doesn't have tasks, work on it normally without progress comments
- Respect user preferences - if they say not to close, leave it open
