import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { MonsterInstance } from "../../monsters/entities/monster-instance.entity.js"
import { MonsterCondition } from "../entities/monster-condition.entity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@EventSubscriber()
export class ConditionCharacterSubscriber implements EntitySubscriberInterface<MonsterInstance> {
  listenTo() {
    return MonsterInstance
  }

  /**
   * @description Listen for remove events on MonsterInstance entity
   *           and remove their conditions
   */
  async beforeRemove(event: RemoveEvent<MonsterInstance>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'ConditionMonsterSubscriber')

    const entities: MonsterInstance[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    for (const monster of entities) {
      try {
        const conditions = await event.manager.find(MonsterCondition, { where: { creature: monster } })
        await event.manager.remove(conditions)
      } catch (error) {
        Logger.error(`${error}`, 'ConditionMonsterSubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'ConditionMonsterSubscriber')
  }
}

registerEntity('ConditionCharacterSubscriber', ConditionCharacterSubscriber)
