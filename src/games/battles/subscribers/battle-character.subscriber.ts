import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Battle } from '../entities/battle.entity'
import { Character } from '../../characters/entities/character.entity'

@EventSubscriber()
export class BattleCharacterSubscriber implements EntitySubscriberInterface<Character> {
  listenTo() {
    return Character
  }

  /**
   * @description Listen for remove events on Character entity
   *              and remove their Battle records
   */
  async beforeRemove(event: RemoveEvent<Character>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'BattleCharacterSubscriber')
    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    for (const character of entities) {
      try {
        const battles = await event.manager.find(Battle, {
          where: [{ initiator: { id: character.id } }, { participants: { id: character.id } }],
          relations: ['initiator', 'participants']
        })
        for (const battle of battles) {
          if (!battle.participants || battle.participants.length <= 1) {
            await event.manager.remove(battle)
          } else {
            battle.participants = battle.participants.filter((p) => p.id !== character.id)
            if (battle.initiator.id === character.id) {
              battle.initiator = battle.participants[0]
            }
            await event.manager.save(battle)
          }
        }
      } catch (error) {
        Logger.error(`${error}`, 'BattleCharacterSubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'BattleCharacterSubscriber')
  }
}
