import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { MonsterInstance } from '../../monsters/entities/monster-instance.entity'

@EventSubscriber()
export class InventoryMonsterSubscriber implements EntitySubscriberInterface<MonsterInstance> {
  listenTo() {
    return MonsterInstance
  }

  async beforeRemove(event: RemoveEvent<MonsterInstance>) {
    // before the monster is removed, we need to populate the loot property on
    // the MonsterInstance entity so that the inventory can be removed in the afterRemove
    // method.
    Logger.debug(`Inventory-MonsterInstance: BEFORE ENTITY WITH ID ${event.entityId} REMOVED`)
    const entities: MonsterInstance[] = Array.isArray(event.entity) ? event.entity : [event.entity]
    for (const monsterinstance of entities) {
      try {
        const monsterWithInventory = await event.manager.findOne(MonsterInstance, {
          where: { id: monsterinstance.id },
          relations: ['loot']
        })
        if (!monsterWithInventory) {
          Logger.debug(
            `Inventory-MonsterInstance (beforeRemove): MonsterInstance with id ${monsterinstance.id} does not exist`
          )
          continue
        }
        monsterinstance.loot = monsterWithInventory.loot
      } catch (error) {
        Logger.error(`Inventory-MonsterInstance (beforeRemove): ${error}`)
        throw error
      }
    }
    Logger.verbose('Inventory-MonsterInstance (beforeRemove): done')
  }

  /**
   * @description Listen for remove events on MonsterInstance entity
   *              and remove their Inventory records
   */
  async afterRemove(event: RemoveEvent<MonsterInstance>) {
    Logger.debug(`Inventory-MonsterInstance: AFTER ENTITY WITH ID ${event.entityId} REMOVED`)
    const entities: MonsterInstance[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove Inventory records associated with MonsterInstance
    for (const monsterinstance of entities) {
      try {
        if (!monsterinstance.loot) continue
        await event.manager.remove(monsterinstance.loot)
      } catch (error) {
        Logger.error(`Inventory-MonsterInstance: ${error}`)
        throw error
      }
    }
    Logger.verbose('Inventory-MonsterInstance: done')
  }
}
