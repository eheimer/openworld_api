import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Character } from '../entities/character.entity'
import { Game } from '../../entities/game.entity'

@EventSubscriber()
export class CharacterGameSubscriber implements EntitySubscriberInterface<Game> {
  listenTo() {
    return Game
  }

  /**
   * @description Listen for remove events on Game entity
   *              and remove their Character records
   */
  async beforeRemove(event: RemoveEvent<Game>) {
    Logger.debug(`Character-Game: BEFORE ENTITY WITH ID ${event.entityId} REMOVED`)
    const entities: Game[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove Character records associated with Game
    for (const game of entities) {
      try {
        const character = await event.manager.find(Character, { where: { game: { id: game.id } } })
        await event.manager.remove(character)
      } catch (error) {
        Logger.error(`Character-Game: ${error}`)
        throw error
      }
    }
    Logger.verbose('Character-Game: done')
  }
}
