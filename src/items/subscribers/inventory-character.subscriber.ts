import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Character } from '../../games/characters/entities/character.entity'

@EventSubscriber()
export class InventoryCharacterSubscriber implements EntitySubscriberInterface<Character> {
  listenTo() {
    return Character
  }

  async beforeRemove(event: RemoveEvent<Character>) {
    // before the character is removed, we need to populate the inventory property on
    // the character entity so that the inventory can be removed in the afterRemove
    // method.
    Logger.debug(`Inventory-Character: BEFORE ENTITY WITH ID ${event.entityId} REMOVED`)
    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]
    for (const character of entities) {
      try {
        const charWithInventory = await event.manager.findOne(Character, {
          where: { id: character.id },
          relations: ['inventory']
        })
        if (!charWithInventory) {
          Logger.debug(`Inventory-Character (beforeRemove): Character with id ${character.id} does not exist`)
          continue
        }
        character.inventory = charWithInventory.inventory
      } catch (error) {
        Logger.error(`Inventory-Character (beforeRemove): ${error}`)
        throw error
      }
    }
    Logger.verbose('Inventory-Character (beforeRemove): done')
  }

  /**
   * @description Listen for remove events on Character entity
   *              and remove their Inventory records
   */
  async afterRemove(event: RemoveEvent<Character>) {
    Logger.debug(`Inventory-Character: AFTER ENTITY WITH ID ${event.entityId} REMOVED`)
    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]
    // Remove Inventory records associated with Character
    for (const character of entities) {
      try {
        if (!character.inventory) continue
        await event.manager.remove(character.inventory)
      } catch (error) {
        Logger.error(`Inventory-Character: ${error}`)
        throw error
      }
    }
    Logger.verbose('Inventory-Character: done')
  }
}
