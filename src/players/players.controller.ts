import { Controller, Get, Param, Request } from '@nestjs/common'
import { PlayersService } from './players.service'
import { Serialize } from 'src/common/serialize.interceptor'
import { PlayerDto } from './dto/player.dto'
import { SerializeResponse } from '../common/serialize.interceptor'
import { PlayerDetailDto } from './dto/player-detail.dto'

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
  async getPlayer(@Param('id') id: string, @Request() req): Promise<Partial<SerializeResponse>> {
    //set detail to true if and only if the requestor is the player being requested
    let detail = false
    if (req.user.id === parseInt(id)) {
      detail = true
    }
    return new SerializeResponse(detail, await this.playersService.findOne(parseInt(id)))
  }
}
