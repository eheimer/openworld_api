import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Battle } from "./entities/battle.entity"
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CharactersService } from "../characters/characters.service"
import { MonstersService } from "../../monsters/monsters.service"
import { MonsterInstance } from "../../monsters/entities/monster-instance.entity"
import { Character } from "../characters/entities/character.entity"
import { getEntity, registerEntity } from "../../entityRegistry"

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle) private readonly repo: Repository<Battle>,
    private readonly charactersService: CharactersService,
    private readonly monstersService: MonstersService
  ) {}

  async create(gameId: number, playerId: number) {
    const character = await this.charactersService.findByPlayerAndGame(playerId, +gameId)
    if (!character) {
      throw new BadRequestException('You must have a character to create a battle')
    }
    if (character.battle) {
      throw new BadRequestException('You are already in a battle')
    }
    const battle = await this.repo.create({
      game: { id: gameId },
      initiator: { id: character.id },
      participants: [{ id: character.id }]
    })
    return await this.repo.save(battle)
  }

  async findOne(battleId: number) {
    return this.resort(
      await this.repo.findOne({
        where: { id: battleId },
        relations: [
          'initiator.player',
          'participants',
          'participants.player',
          'game',
          'enemies.nextAction.action',
          'enemies.monster.actions.action',
          'enemies.monster.damageType',
          'enemies.monster.breathDmgType',
          'friendlies.monster.damageType',
          'friendlies.monster.breathDmgType'
        ]
      })
    )
  }

  findOneByInitiator(playerId: number, battleId: number): Promise<Battle> {
    return this.repo.findOne({ where: { id: battleId, initiator: { player: { id: playerId } } } })
  }

  async remove(id: number) {
    const battle = await this.findOne(id)
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    if (!battle.participants || !Array.isArray(battle.participants)) {
      throw new Error('Participants are not properly loaded or are invalid: ' + battle.participants)
    }
    //remove all participants from the battle
    for (const participant of battle.participants as Array<Character>) {
      await this.leave(battle.id, participant.player.id)
    }
    return await this.repo.remove(battle)
  }

  async join(battleId: number, playerId: number) {
    const battle = await this.findOne(battleId)
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    const character = await this.charactersService.findByPlayerAndGame(playerId, battle.game.id)
    if (!character) {
      throw new BadRequestException('You must have a character to join a battle')
    }
    if (character.battle) {
      throw new BadRequestException('You are already in a battle')
    }
    battle.participants.push(character)
    return await this.repo.save(battle)
  }

  async leave(battleId: number, playerId: number) {
    const battle = await this.findOne(battleId)
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    const character = await this.charactersService.findByPlayerAndGame(playerId, battle.game.id)
    if (!character) {
      throw new BadRequestException('You must have a character to leave a battle')
    }
    battle.participants = battle.participants.filter((p) => p.id !== character.id)
    return await this.repo.save(battle)
  }

  async addEnemyToBattle(battleId: number, enemyId: number) {
    const battle = await this.repo.findOne({ where: { id: battleId }, relations: ['enemies'] })
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    const enemy = await this.monstersService.findOneInstance(enemyId)
    if (!enemy) {
      throw new NotFoundException('Monster instance not found')
    }
    battle.enemies.push(enemy)
    return this.resort(await this.repo.save(battle))
  }

  async nextRound(battleId: number) {
    const battle = await this.findOne(battleId)
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    // increment the round- there are only 8 rounds before it loops back to 1
    battle.round = (battle.round % 8) + 1
    // set the next action for each enemy
    for (const enemy of battle.enemies) {
      enemy.nextAction = await this.monstersService.getNextAction(enemy.monster.actions)
    }
    //TODO: when conditions are implemented, process them here
    return this.resort(await this.repo.save(battle))
  }

  /**
   *
   * @description Sorts the enemies and friendlies by initiative
   *
   * @param battle
   * @returns
   */
  resort(battle: Battle): Battle {
    battle.enemies = this.sortInitiative(battle.enemies)
    battle.friendlies = this.sortInitiative(battle.friendlies)
    return battle
  }

  sortInitiative(monsters: MonsterInstance[]) {
    if (!monsters) return monsters
    monsters.sort((a, b) => a.nextAction?.action?.initiative - b.nextAction?.action?.initiative)
    return monsters
  }
}

registerEntity('BattlesService', BattlesService)
