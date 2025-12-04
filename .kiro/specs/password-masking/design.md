# Design Document

## Overview

This design implements a secure logging solution that masks sensitive fields (passwords, tokens, etc.) in HTTP request logs while preserving the structure and non-sensitive content for debugging purposes. The solution modifies the existing LoggerMiddleware to apply field masking before logging request bodies.

## Architecture

The masking functionality will be implemented as a utility function within the LoggerMiddleware. The architecture follows these principles:

1. **Single Responsibility**: The masking logic is isolated in a dedicated function
2. **Immutability**: Original request objects are not modified; masking operates on a deep copy
3. **Configurability**: Sensitive field names are defined in a centralized list for easy maintenance
4. **Performance**: Masking only occurs during logging (verbose level), not during request processing

### Component Interaction

```
HTTP Request → LoggerMiddleware → maskSensitiveFields() → Logger.verbose()
                                          ↓
                                   Deep Copy + Mask
```

## Components and Interfaces

### Modified Component: LoggerMiddleware

**Location**: `src/middleware/logger.middleware.ts`

**Changes**:
- Add `maskSensitiveFields()` private method
- Add `SENSITIVE_FIELDS` constant array
- Modify `use()` method to mask request body before logging

### New Utility Function: maskSensitiveFields

**Signature**:
```typescript
private maskSensitiveFields(obj: any): any
```

**Parameters**:
- `obj`: The object to mask (typically req.body)

**Returns**:
- A deep copy of the object with sensitive fields replaced by `'***REDACTED***'`

**Behavior**:
- Returns primitives unchanged
- Returns null/undefined unchanged
- Creates deep copy of objects and arrays
- Recursively processes nested structures
- Replaces values of fields matching SENSITIVE_FIELDS (case-insensitive)

### Configuration Constant: SENSITIVE_FIELDS

**Type**: `string[]`

**Initial Values**: `['password', 'token', 'apikey', 'secret']`

**Purpose**: Centralized list of field names that should be masked in logs

## Data Models

No new data models are required. The solution operates on existing request body structures.

### Input Structure (Example)

```typescript
// Login request
{
  username: "player1",
  password: "secretPassword123"
}

// Register request
{
  username: "newplayer",
  password: "myPassword456",
  email: "player@example.com"
}
```

### Output Structure (Example)

```typescript
// Masked login request
{
  username: "player1",
  password: "***REDACTED***"
}

// Masked register request
{
  username: "newplayer",
  password: "***REDACTED***",
  email: "player@example.com"
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Comprehensive sensitive field masking

*For any* object containing fields with names matching the sensitive fields list (at any depth, including within nested objects and arrays), the masking function should replace all matching field values with the redaction placeholder.

**Validates: Requirements 1.1, 1.3, 1.4**

### Property 2: Non-sensitive field preservation

*For any* object without sensitive fields, the masking function should return a deep copy that is structurally equivalent to the original object.

**Validates: Requirements 1.2, 2.1**

### Property 3: Structure preservation

*For any* object, the masked output should maintain the same keys, nesting levels, and array lengths as the input, with only sensitive field values replaced.

**Validates: Requirements 2.2**

### Property 4: Case-insensitive field matching

*For any* object containing fields with names that match sensitive field names in any case variation (lowercase, uppercase, mixed case), the masking function should mask all variations.

**Validates: Requirements 3.3**

## Error Handling

The masking function is designed to be defensive and handle edge cases gracefully:

1. **Null/Undefined Input**: Returns the input unchanged
2. **Primitive Values**: Returns the value unchanged (numbers, strings, booleans)
3. **Circular References**: Not explicitly handled in initial implementation (assumes request bodies are JSON-serializable)
4. **Non-Object Types**: Returns unchanged
5. **Empty Objects/Arrays**: Returns empty copy of same type

### Logging Behavior

- Masking only occurs at `Logger.verbose()` level
- If verbose logging is disabled, masking overhead is avoided
- Original request object is never modified (immutability preserved)

## Testing Strategy

### Unit Testing

Unit tests will verify specific behaviors of the `maskSensitiveFields()` function:

1. **Concrete Examples**:
   - Login DTO with username and password
   - Register DTO with username, password, and email
   - Empty objects and arrays
   - Null and undefined inputs

2. **Edge Cases**:
   - Deeply nested objects (5+ levels)
   - Arrays of objects with sensitive fields
   - Mixed case field names (Password, PASSWORD, password)
   - Objects with no sensitive fields

### Property-Based Testing

Property-based tests will verify universal properties across randomly generated inputs using **fast-check** (JavaScript/TypeScript property testing library).

**Configuration**: Each property test should run a minimum of 100 iterations.

**Test Tagging**: Each property-based test must include a comment in this format:
```typescript
// Feature: password-masking, Property {number}: {property_text}
```

**Property Test Coverage**:

1. **Property 1 Test**: Generate random objects with sensitive fields at various depths and in arrays, verify all are masked
2. **Property 2 Test**: Generate random objects without sensitive fields, verify output equals input (deep equality)
3. **Property 3 Test**: Generate random objects, verify masked output has same structure (keys, depth, array lengths)
4. **Property 4 Test**: Generate objects with case variations of sensitive field names, verify all variations are masked

### Integration Testing

Integration tests will verify the middleware behavior in the context of actual HTTP requests:

1. POST to `/auth/login` with credentials - verify password is masked in logs
2. POST to `/auth/register` with player data - verify password is masked, other fields visible
3. Requests to other endpoints - verify non-sensitive data is logged normally

### Test Utilities

A test helper function will be created to capture log output during tests for verification.

## Implementation Notes

### Performance Considerations

- Deep copying and recursive traversal have O(n) complexity where n is the number of fields
- For typical request bodies (< 100 fields), performance impact is negligible
- Masking only occurs during logging, not during request processing

### Future Enhancements

1. **Configuration File**: Move SENSITIVE_FIELDS to a configuration file for runtime updates
2. **Partial Masking**: Show first/last characters of sensitive values (e.g., "p***d")
3. **Audit Logging**: Separate audit logs that track authentication attempts without sensitive data
4. **Additional Sensitive Fields**: Add support for tokens, API keys, credit card numbers, etc.

## Dependencies

No new external dependencies required. The solution uses:
- Native JavaScript/TypeScript features (Object.keys, Array.isArray, typeof)
- Existing NestJS Logger
- Existing middleware infrastructure
