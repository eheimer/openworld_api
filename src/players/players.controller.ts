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
  @Serialize(PlayerDto, PlayerDetailDto)
  async getAllPlayers(@CurrentPlayer() player: Player) {
    return new SerializeResponse(await this.playersService.findAll(), 'id', player.id)
  }

  @Get('/:id')
  @Serialize(PlayerDto, PlayerDetailDto)
  async getPlayer(@Param('id') id: string, @CurrentPlayer() player: Player): Promise<Partial<SerializeResponse>> {
    return new SerializeResponse(await this.playersService.findOne(parseInt(id)), 'id', player.id)
  }
}
