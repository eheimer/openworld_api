import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Game } from '../../entities/game.entity'
import { Battle } from '../entities/battle.entity'

@EventSubscriber()
export class BattleGameSubscriber implements EntitySubscriberInterface<Game> {
  listenTo() {
    return Game
  }

  /**
   * @description Listen for remove events on Game entity
   *              and remove their Battle records
   */
  async beforeRemove(event: RemoveEvent<Game>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, 'BattleGameSubscriber')
    const entities: Game[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    // Remove Battle records associated with Game
    for (const game of entities) {
      try {
        const battle = await event.manager.find(Battle, { where: { game: { id: game.id } } })
        await event.manager.remove(battle)
      } catch (error) {
        Logger.error(`${error}`, 'BattleGameSubscriber')
        throw error
      }
    }
    Logger.verbose('done', 'BattleGameSubscriber')
  }
}
