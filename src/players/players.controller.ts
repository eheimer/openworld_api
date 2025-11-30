import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { PlayersService } from "./players.service"
import { UpdatePlayerDto } from "./dto/update-player.dto"
import { Serialize } from "../interceptors/serialize.interceptor"
import { PlayerDto } from "../players/dto/player.dto"
import { PlayerDetailDto } from "../players/dto/player-detail.dto"
import { SerializeResponse } from "../interceptors/serialize.interceptor"
import { CurrentPlayer } from "../decorators/current-player.decorator"
import { Player } from "./entities/player.entity"
import { CurrentPlayerGuard } from "../guards/authorization/player-current-player.guard"
import { getEntity, registerEntity } from "../entityRegistry"

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

  @Patch(':playerId')
  @UseGuards(CurrentPlayerGuard)
  @Serialize(PlayerDetailDto)
  update(@Param('playerId') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(+id, updatePlayerDto)
  }

  @Delete(':playerId')
  @UseGuards(CurrentPlayerGuard)
  @Serialize(PlayerDetailDto)
  async remove(@Param('playerId') id: string) {
    return await this.playersService.remove(+id)
  }
}

registerEntity('PlayersController', PlayersController)
