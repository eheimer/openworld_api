import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Battle } from "../../games/battles/entities/battle.entity"
import { MonsterInstance } from "../entities/monster-instance.entity"

@EventSubscriber()
export class MonsterBattleSubscriber implements EntitySubscriberInterface<Battle> {
  listenTo() {
    return Battle
  }

  /**
   * @description Listen for remove events on Battle entity
   *              and remove enemies and friendlies (not pets)
   */
  async beforeRemove(event: RemoveEvent<Battle>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'MonsterBattleSubscriber')
    const entities: Battle[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove MonsterInstance records associated with Battle
    for (const battle of entities) {
      try {
        let monsters = await event.manager.find(MonsterInstance, {
          where: [{ battleAsEnemy: { id: battle.id } }, { battleAsFriendly: { id: battle.id } }],
          relations: ['owner']
        })

        const pets = monsters?.filter((monster) => monster.owner != null)
        monsters = monsters?.filter((monster) => monster.owner == null)

        //monsters get deleted
        if (monsters?.length > 0) {
          await event.manager.remove(monsters)
        }

        //pets just need to be updated to remove them from the battle
        if (pets?.length > 0) {
          await event.manager.update(
            MonsterInstance,
            pets.map((pet) => pet.id),
            { battleAsEnemy: null, battleAsFriendly: null }
          )
        }
      } catch (error) {
        Logger.error(`${error}`, 'MonsterBattleSubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'MonsterBattleSubscriber')
  }
}

