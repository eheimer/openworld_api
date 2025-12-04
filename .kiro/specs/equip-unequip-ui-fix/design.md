# Design Document

## Overview

This design addresses a client-side bug in the test client's inventory management interface. The API correctly returns inventory data with equipped status information, but the Vue component fails to properly parse and display this data. The component incorrectly expects `equippedArmor`, `equippedWeapons`, `equippedJewelry`, and `equippedSpellbooks` arrays in the API response, which do not exist. Instead, the API provides:

1. Item arrays (`armor`, `weapons`, `jewelry`, `spellbooks`) where each item has an `equipped` boolean property
2. An `equipped` array containing metadata about equipped items

The fix involves updating the Vue component to correctly parse the API response and compute the equipped items from the existing data structure.

## Architecture

### Current Architecture

```
API Response → Vue Component State → Template Rendering
```

The component currently:
- Receives inventory data from `/inventory/{id}` endpoint
- Stores raw response in `inventory` ref
- Attempts to render non-existent `equippedArmor`, `equippedWeapons`, etc. arrays
- Always shows "Equip" buttons regardless of item state

### Target Architecture

```
API Response → Vue Component State → Computed Properties → Template Rendering
```

The component will:
- Receive inventory data from `/inventory/{id}` endpoint
- Store raw response in `inventory` ref
- Use computed properties to filter equipped items from each category
- Use computed properties or helper functions to determine button state
- Render equipped items and correct button states dynamically

## Components and Interfaces

### API Response Structure

Based on `InventoryDto`, the API returns:

```typescript
{
  id: number
  capacity: number
  gold: number
  weapons: ItemInstanceDto[]      // Each has 'equipped' boolean
  armor: ItemInstanceDto[]        // Each has 'equipped' boolean
  jewelry: ItemInstanceDto[]      // Each has 'equipped' boolean
  spellbooks: SpellbookInstanceDto[]  // Each has 'equipped' boolean
  equipped: Array<{               // Metadata array
    itemType: string
    location: number | undefined
    id: number
  }>
}
```

### Vue Component Changes

**File:** `client-src/src/components/InventoryComponent.vue`

#### New Computed Properties

```javascript
// Filter equipped items from each category
const equippedArmor = computed(() => {
  return inventory.value?.armor?.filter(item => item.equipped) || []
})

const equippedWeapons = computed(() => {
  return inventory.value?.weapons?.filter(item => item.equipped) || []
})

const equippedJewelry = computed(() => {
  return inventory.value?.jewelry?.filter(item => item.equipped) || []
})

const equippedSpellbooks = computed(() => {
  return inventory.value?.spellbooks?.filter(item => item.equipped) || []
})
```

#### Helper Function for Button State

```javascript
/**
 * Determine if an item is equipped
 * @param {Object} item - The item to check
 * @returns {boolean} - True if equipped
 */
const isItemEquipped = (item) => {
  return item.equipped === true
}
```

#### Template Updates

1. Replace `inventory.equippedArmor` with `equippedArmor` (computed property)
2. Replace `inventory.equippedWeapons` with `equippedWeapons` (computed property)
3. Replace `inventory.equippedJewelry` with `equippedJewelry` (computed property)
4. Replace `inventory.equippedSpellbooks` with `equippedSpellbooks` (computed property)
5. Update inventory item buttons to conditionally show "Equip" or "Unequip" based on `item.equipped`
6. Update button classes to apply green color for equipped items, blue for unequipped

## Data Models

### Item Instance Structure

Each item in the inventory arrays has this structure:

```typescript
{
  id: number
  name: string
  level: number
  equipped: boolean  // KEY PROPERTY for determining state
  // ... other item-specific properties
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Equipped items filtering

*For any* inventory response containing item arrays, the computed equipped items arrays should contain exactly those items where the `equipped` property is `true`.

**Validates: Requirements 1.4**

### Property 2: Button text determination

*For any* inventory item, the button text should be "Unequip" if and only if the item's `equipped` property is `true`, otherwise it should be "Equip".

**Validates: Requirements 2.1, 2.2**

### Property 3: Button styling determination

*For any* inventory item, the button should have green styling if and only if the item's `equipped` property is `true`, otherwise it should have blue styling.

**Validates: Requirements 2.3, 2.4**

## Error Handling

### API Error Handling

The component already has error handling for API calls. No changes needed:
- Network errors display user-friendly messages
- API error responses are caught and displayed
- Loading states prevent duplicate requests

### Data Validation

The component should handle edge cases:
- Missing or null inventory data (already handled with optional chaining)
- Items without `equipped` property (treat as `false`)
- Empty item arrays (already handled)

## Testing Strategy

### Unit Testing

Since this is a Vue component fix, unit testing will focus on the computed properties and helper functions:

**Test Cases:**
1. **Equipped items filtering** - Verify computed properties correctly filter items
   - Test with all items unequipped
   - Test with some items equipped
   - Test with all items equipped
   - Test with empty arrays
   - Test with null/undefined inventory

2. **Button state determination** - Verify helper function returns correct values
   - Test with `equipped: true`
   - Test with `equipped: false`
   - Test with missing `equipped` property

3. **Template rendering** - Verify conditional rendering logic
   - Test button text changes based on equipped state
   - Test button class changes based on equipped state

### Property-Based Testing

Property-based testing is not applicable for this bug fix because:
- The fix involves Vue component rendering and reactivity
- Properties would require a browser environment and Vue runtime
- The logic is simple boolean checks that are better suited to example-based unit tests
- Integration tests in a browser environment would be more valuable than property tests

### Manual Testing

Manual testing in the test client is essential:
1. Load a character with inventory
2. Add items to inventory
3. Equip an item and verify:
   - Item appears in "Equipped Items" section
   - Button changes to "Unequip" with green color
4. Unequip an item and verify:
   - Item disappears from "Equipped Items" section
   - Button changes to "Equip" with blue color
5. Verify consistency across multiple equip/unequip operations

### Testing Framework

- **Vue Test Utils** - For component unit testing
- **Jest** - Test runner (already configured in project)
- **Manual QA** - Primary verification method for this UI fix

## Implementation Notes

### Vue Reactivity

The fix leverages Vue 3's reactivity system:
- Computed properties automatically update when `inventory.value` changes
- Template re-renders when computed properties change
- No manual DOM manipulation needed

### Backward Compatibility

This fix does not change:
- API contracts
- Component props or events
- Component public interface
- Other components or services

### Performance Considerations

- Computed properties are cached and only recalculate when dependencies change
- Filtering operations are O(n) but inventory sizes are small (< 100 items typically)
- No performance impact expected

## Implementation Steps

1. Add computed properties for equipped items (one per item type)
2. Add helper function to check if item is equipped
3. Update template to use computed properties instead of non-existent API properties
4. Update template to conditionally render button text based on equipped state
5. Update template to conditionally apply button classes based on equipped state
6. Test manually in the test client
7. Write unit tests for computed properties and helper function (optional)
