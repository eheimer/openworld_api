import { Controller, Get, Param } from '@nestjs/common'
import { PlayersService } from './players.service'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { PlayerDto } from './dto/player.dto'
import { SerializeResponse } from '../interceptors/serialize.interceptor'
import { PlayerDetailDto } from './dto/player-detail.dto'
import { CurrentPlayer } from 'src/decorators/current-player.decorator'
import { Player } from './player.entity'

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get('/')
  @Serialize(PlayerDto)
  getAllPlayers() {
    return this.playersService.findAll()
  }

  @Get('/:id')
  @Serialize(PlayerDto, PlayerDetailDto)
  async getPlayer(@Param('id') id: string, @CurrentPlayer() player: Player): Promise<Partial<SerializeResponse>> {
    //set detail to true if and only if the requestor is the player being requested
    let detail = false
    if (player.id === parseInt(id)) {
      detail = true
    }
    return new SerializeResponse(detail, await this.playersService.findOne(parseInt(id)))
  }
}
