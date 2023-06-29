import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Inventory } from '../../entities/inventory.entity'
import { SpellbookInstanceAttribute } from '../entities/spellbook-instance-attribute.entity'

@EventSubscriber()
export class SpellbookInventorySubscriber implements EntitySubscriberInterface<Inventory> {
  listenTo() {
    return Inventory
  }

  /**
   * @description Listen for remove events on Inventory entity
   *              and remove their SpellbookInstance and all associated records
   */
  async beforeRemove(event: RemoveEvent<Inventory>) {
    Logger.debug(`Spellbook-Inventory: BEFORE ENTITY WITH ID ${event.entityId} REMOVED`)
    const entities: Inventory[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove SpellbookInstance records associated with Inventory
    for (const inventory of entities) {
      if (inventory?.spellbooks == null) continue
      try {
        const attrib = await event.manager.find(SpellbookInstanceAttribute, {
          where: { spellbook: inventory.spellbooks }
        })
        if (attrib) await event.manager.remove([attrib, inventory.spellbooks])
        await event.manager.remove(inventory.spellbooks)
      } catch (error) {
        Logger.error(`Spellbook-Inventory: ${error}`)
        throw error
      }
    }
    Logger.verbose('Spellbook-Inventory: done')
  }
}
