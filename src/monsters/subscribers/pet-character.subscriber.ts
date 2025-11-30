import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { MonsterInstance } from "../entities/monster-instance.entity"
import { Character } from "../../games/characters/entities/character.entity"

@EventSubscriber()
export class PetCharacterSubscriber implements EntitySubscriberInterface<Character> {
  listenTo() {
    return Character
  }

  /**
   * @description Listen for remove events on Character entity
   *              and remove any MonsterInstance (Pet) records
   */
  async beforeRemove(event: RemoveEvent<Character>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'PetCharacterSubscriber')
    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove MonsterInstance records associated with Character
    for (const character of entities) {
      try {
        const monsterinstance = await event.manager.find(MonsterInstance, { where: { owner: character } })
        await event.manager.remove(monsterinstance)
      } catch (error) {
        Logger.error(`${error}`, 'PetCharacterSubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'PetCharacterSubscriber')
  }
}

