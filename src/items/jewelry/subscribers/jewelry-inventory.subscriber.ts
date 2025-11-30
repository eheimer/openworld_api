import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Inventory } from "../../entities/inventory.entity"
import { JewelryInstanceAttribute } from "../entities/jewelry-instance-attribute.entity"

@EventSubscriber()
export class JewelryInventorySubscriber implements EntitySubscriberInterface<Inventory> {
  listenTo() {
    return Inventory
  }

  /**
   * @description Listen for remove events on Inventory entity
   *              and remove their JewelryInstance and all associated records
   */
  async beforeRemove(event: RemoveEvent<Inventory>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'JewelryInventorySubscriber')
    const entities: Inventory[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove JewelryInstance records associated with Inventory
    for (const inventory of entities) {
      if (inventory?.jewelry == null) continue
      try {
        const attrib = await event.manager.find(JewelryInstanceAttribute, { where: { jewelry: inventory.jewelry } })
        if (attrib) await event.manager.remove(attrib)
        await event.manager.remove(inventory.jewelry)
      } catch (error) {
        Logger.error(`${error}`, 'JewelryInventorySubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'JewelryInventorySubscriber')
  }
}

