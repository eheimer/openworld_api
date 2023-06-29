import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Character } from '../entities/character.entity'

@EventSubscriber()
export class CharacterSkillCharacterSubscriber implements EntitySubscriberInterface<Character> {
  listenTo() {
    return Character
  }

  /**
   * @description Listen for remove events on Character entity
   *              and remove their CharacterSkill records
   */
  async beforeRemove(event: RemoveEvent<Character>) {
    Logger.debug(`Skill-Character: BEFORE ENTITY WITH ID ${event.entityId} REMOVED`)
    const entities: Character[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove CharacterSkill records associated with Character
    for (const character of entities) {
      if (character.skills?.length > 0) {
        try {
          await event.manager.remove(character.skills)
        } catch (error) {
          Logger.error(`Skill-Character: ${error}`)
          throw error
        }
      }
    }
    Logger.verbose('Skill-Character: done')
  }
}
