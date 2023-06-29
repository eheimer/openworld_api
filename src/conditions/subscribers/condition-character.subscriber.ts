import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Character } from '../../games/characters/entities/character.entity'
import { CharacterCondition } from '../entities/character-condition.entity'

@EventSubscriber()
export class ConditionCharacterSubscriber implements EntitySubscriberInterface<Character> {
  listenTo() {
    return Character
  }

  /**
   * @description Listen for remove events on Character entity
   *           and remove their conditions
   */
  async beforeRemove(event: RemoveEvent<Character>) {
    Logger.debug(`Condition-Character: BEFORE ENTITY WITH ID ${event.entityId} REMOVED`)

    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    for (const character of entities) {
      try {
        const conditions = await event.manager.find(CharacterCondition, { where: { character: { id: character.id } } })
        await event.manager.remove(conditions)
      } catch (error) {
        Logger.error(`Condition-Character: ${error}`)
        throw error
      }
    }
    Logger.verbose('Condition-Character: done')
  }
}
