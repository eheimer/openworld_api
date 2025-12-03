# Test Client Maintenance

## Overview

The test client at `/client/` provides manual QA testing capabilities for the Openworld API. It must be kept in sync with API changes to remain useful.

## Requirements for API Changes

When implementing new API functionality or modifying existing endpoints:

1. **Update Test Client UI**: Add or modify components in the test client to expose the new/changed functionality
2. **Update API Service**: Add helper methods for new endpoints
3. **Test the Integration**: Manually verify the test client can successfully call the new/changed endpoints
4. **Update Documentation**: Document any new test workflows in the test client

## Adding New Test Interfaces

To add a new test interface to the client:

1. Create a new Vue component in `client-src/src/components/`
2. Add navigation link in `App.vue`
3. Implement form inputs for request parameters
4. Use the API service to make requests
5. Display request/response details using `ApiLogComponent`
6. Build and test the updated client

## Synchronization Checklist

- [ ] New API endpoint has corresponding UI in test client
- [ ] API service includes helper method for new endpoint
- [ ] Test client can successfully call the endpoint
- [ ] Request/response display works correctly
- [ ] Error handling is implemented
- [ ] Documentation is updated

## Build and Deployment

After making changes to the test client:

```bash
cd client-src
npm run build
cd ..
# Test with NestJS
npm run start:dev
# Navigate to http://localhost:3000/client/
```

### Production Deployment

The deployment script (`deployment/deploy.sh`) handles building the client automatically:
1. Pulls latest code
2. Installs dependencies with `npm ci` (uses package-lock.json)
3. Builds client in `client-src/`
4. Builds NestJS application
5. Copies built files and `_static/` to production
6. Installs production dependencies

**Important:** Always commit `package-lock.json` files to ensure consistent dependencies across environments.
