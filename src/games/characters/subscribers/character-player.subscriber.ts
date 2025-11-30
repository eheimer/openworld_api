import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Player } from "../../../players/entities/player.entity"
import { Character } from "../entities/character.entity"

@EventSubscriber()
export class CharacterPlayerSubscriber implements EntitySubscriberInterface<Player> {
  listenTo() {
    return Player
  }

  /**
   * @description Listen for remove events on Player entity
   *              and remove their Character records
   */
  async beforeRemove(event: RemoveEvent<Player>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'CharacterPlayerSubscriber')
    const entities: Player[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove Character records associated with Player
    for (const player of entities) {
      try {
        const characters = await event.manager.find(Character, {
          where: { player: { id: player.id } },
          relations: ['battle']
        })
        if (characters.length > 0) {
          for (const character of characters) {
            if (character.battle) {
              character.battle = null
              await event.manager.save(character)
            }
          }
          await event.manager.remove(characters)
        }
      } catch (error) {
        Logger.error(`${error}`, 'CharacterPlayerSubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'CharacterPlayerSubscriber')
  }
}

