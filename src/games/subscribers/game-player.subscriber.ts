import { Logger } from '@nestjs/common'
import { EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm'
import { Player } from "../../players/entities/player.entity.js"
import { Game } from "../entities/game.entity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@EventSubscriber()
export class GamePlayerSubscriber implements EntitySubscriberInterface<Player> {
  listenTo() {
    return Player
  }

  /**
   * @description Listen for remove events on Player entity
   *              and remove their Game records
   */
  async beforeRemove(event: RemoveEvent<Player>) {
    Logger.debug(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED`, `GamePlayerSubscriber`)
    const entities: Player[] = Array.isArray(event.entity) ? event.entity : [event.entity]

    for (const player of entities) {
      try {
        const games = await event.manager.find(Game, {
          where: [{ owner: { id: player.id } }, { players: { id: player.id } }],
          relations: ['players', 'owner']
        })

        for (const game of games) {
          if (!game.players || game.players.length <= 1) {
            await event.manager.remove(game)
          } else {
            game.players = game.players.filter((p) => p.id !== player.id)
            if (game.owner.id === player.id) {
              game.owner = game.players[0]
            }
            await event.manager.save(game)
          }
        }
      } catch (error) {
        Logger.error(`${error}`, `GamePlayerSubscriber`)
        throw error
      }
    }
    Logger.verbose('done', `GamePlayerSubscriber`)
  }
}

registerEntity('GamePlayerSubscriber', GamePlayerSubscriber)
