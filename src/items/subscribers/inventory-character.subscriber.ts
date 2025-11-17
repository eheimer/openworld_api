import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Character } from "../../games/characters/entities/character.entity.js"

@EventSubscriber()
export class InventoryCharacterSubscriber implements EntitySubscriberInterface<Character> {
  listenTo() {
    return Character
  }

  async beforeRemove(event: RemoveEvent<Character>) {
    // before the character is removed, we need to populate the inventory property on
    // the character entity so that the inventory can be removed in the afterRemove
    // method.
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'InventoryCharacterSubscriber')
    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]
    for (const character of entities) {
      try {
        const charWithInventory = await event.manager.findOne(Character, {
          where: { id: character.id },
          relations: ['inventory']
        })
        if (!charWithInventory) {
          Logger.debug(`beforeRemove: Character with id ${character.id} does not exist`, 'InventoryCharacterSubscriber')
          continue
        }
        character.inventory = charWithInventory.inventory
      } catch (error) {
        Logger.error(`beforeRemove: ${error}`, 'InventoryCharacterSubscriber')
        throw error
      }
    }
    Logger.verbose('beforeRemove: done', 'InventoryCharacterSubscriber')
  }

  /**
   * @description Listen for remove events on Character entity
   *              and remove their Inventory records
   */
  async afterRemove(event: RemoveEvent<Character>) {
    Logger.debug(`AFTER ENTITY WITH ID ${event.entityId} REMOVED`, 'InventoryCharacterSubscriber')
    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]
    // Remove Inventory records associated with Character
    for (const character of entities) {
      try {
        if (!character.inventory) continue
        await event.manager.remove(character.inventory)
      } catch (error) {
        Logger.error(`${error}`, 'InventoryCharacterSubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'InventoryCharacterSubscriber')
  }
}

(globalThis as any).InventoryCharacterSubscriber = InventoryCharacterSubscriber
