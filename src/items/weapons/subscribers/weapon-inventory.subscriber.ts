import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Inventory } from "../../entities/inventory.entity.js"
import { WeaponInstanceAttribute } from "../entities/weapon-instance-attribute.entity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

@EventSubscriber()
export class WeaponInventorySubscriber implements EntitySubscriberInterface<Inventory> {
  listenTo() {
    return Inventory
  }

  /**
   * @description Listen for remove events on Inventory entity
   *              and remove their WeaponInstance and all associated records
   */
  async beforeRemove(event: RemoveEvent<Inventory>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'WeaponInventorySubscriber')
    const entities: Inventory[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove WeaponInstance records associated with Inventory
    for (const inventory of entities) {
      if (inventory?.weapons == null) continue
      try {
        const attrib = await event.manager.find(WeaponInstanceAttribute, { where: { weapon: inventory.weapons } })
        if (attrib) await event.manager.remove(attrib)
        await event.manager.remove(inventory.weapons)
      } catch (error) {
        Logger.error(`${error}`, 'WeaponInventorySubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'WeaponInventorySubscriber')
  }
}

registerEntity('WeaponInventorySubscriber', WeaponInventorySubscriber)
