import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common'
import { PlayersService } from './players.service'
import { UpdatePlayerDto } from './dto/update-player.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { PlayerDto } from '../players/dto/player.dto'
import { PlayerDetailDto } from '../players/dto/player-detail.dto'
import { SerializeResponse } from '../interceptors/serialize.interceptor'
import { CurrentPlayer } from 'src/decorators/current-player.decorator'
import { Player } from './entities/player.entity'

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('')
  @Serialize(PlayerDto, PlayerDetailDto)
  async findAll(@CurrentPlayer() player: Player) {
    return new SerializeResponse(await this.playersService.findAll(), 'id', player.id)
  }

  @Get(':id')
  @Serialize(PlayerDto, PlayerDetailDto)
  async findOne(@Param('id') id: string, @CurrentPlayer() player: Player) {
    return new SerializeResponse(await this.playersService.findOne(+id), 'id', player.id)
  }

  @Patch(':id')
  //TODO: create a @CurrentPlayerGuard()
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(+id, updatePlayerDto)
  }

  @Delete(':id')
  //TODO: create a @CurrentPlayerGuard()
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id)
  }
}
