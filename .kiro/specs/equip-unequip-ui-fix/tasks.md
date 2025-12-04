# Implementation Plan

- [x] 1. Add computed properties for filtering equipped items
  - Create `equippedArmor` computed property that filters `inventory.value.armor` for items where `equipped === true`
  - Create `equippedWeapons` computed property that filters `inventory.value.weapons` for items where `equipped === true`
  - Create `equippedJewelry` computed property that filters `inventory.value.jewelry` for items where `equipped === true`
  - Create `equippedSpellbooks` computed property that filters `inventory.value.spellbooks` for items where `equipped === true`
  - Handle null/undefined cases with optional chaining and default to empty arrays
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Update Equipped Items section template
  - Replace `inventory.equippedArmor` with `equippedArmor` computed property
  - Replace `inventory.equippedWeapons` with `equippedWeapons` computed property
  - Replace `inventory.equippedJewelry` with `equippedJewelry` computed property
  - Replace `inventory.equippedSpellbooks` with `equippedSpellbooks` computed property
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Update Inventory Contents section for dynamic button states
  - Add conditional rendering for button text: show "Unequip" if `item.equipped === true`, otherwise "Equip"
  - Add conditional CSS classes: apply green button class if `item.equipped === true`, otherwise blue
  - Update all four item type sections (armor, weapons, jewelry, spellbooks)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

- [x] 4. Update computed properties return statement
  - Export new computed properties in the component's return statement
  - Ensure they are available to the template
  - _Requirements: 1.4_

- [ ] 5. Manual testing and verification
  - Build the client with `npm run build` in `client-src/`
  - Start the dev server with `npm run start:dev`
  - Navigate to the inventory test page
  - Verify equipped items appear in "Equipped Items" section after equipping
  - Verify equipped items disappear from "Equipped Items" section after unequipping
  - Verify buttons show "Unequip" with green color for equipped items
  - Verify buttons show "Equip" with blue color for unequipped items
  - Verify consistency across multiple equip/unequip operations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_
