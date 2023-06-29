import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Inventory } from '../../entities/inventory.entity'
import { ArmorInstanceAttribute } from '../entities/armor-instance-attribute.entity'
import { ArmorInstanceDamageReduction } from '../entities/armor-instance-damage-reduction.entity'

@EventSubscriber()
export class ArmorInventorySubscriber implements EntitySubscriberInterface<Inventory> {
  listenTo() {
    return Inventory
  }

  /**
   * @description Listen for remove events on Inventory entity
   *              and remove their ArmorInstance and all associated records
   */
  async beforeRemove(event: RemoveEvent<Inventory>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'ArmorInventorySubscriber')
    const entities: Inventory[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove ArmorInstance records associated with Inventory
    for (const inventory of entities) {
      if (inventory?.armor == null) continue
      try {
        const reduc = await event.manager.find(ArmorInstanceDamageReduction, {
          where: { armor: inventory.armor }
        })
        const attrib = await event.manager.find(ArmorInstanceAttribute, {
          where: { armor: inventory.armor }
        })
        if (reduc) await event.manager.remove(reduc)
        if (attrib) await event.manager.remove(attrib)
        await event.manager.remove(inventory.armor)
      } catch (error) {
        Logger.error(`${error}`, 'ArmorInventorySubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'ArmorInventorySubscriber')
  }
}
