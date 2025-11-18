import { Body, Controller, Get, Header, Post, UseGuards } from '@nestjs/common'
import { AuthService } from "./auth.service.js"
import { PlayersService } from "../players/players.service.js"
import { Public } from "../decorators/public-auth.decorator.js"
import { LocalAuthGuard } from "../guards/authentication/local-auth.guard.js"
import { Player } from "../players/entities/player.entity.js"
import { CreatePlayerDto } from "../players/dto/create-player.dto.js"
import { CurrentPlayer } from "../decorators/current-player.decorator.js"
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Serialize } from "../interceptors/serialize.interceptor.js"
import { PlayerDetailDto } from "../players/dto/player-detail.dto.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService, private playersService: PlayersService) {}

  @Post('login')
  @Header('Content-Type', 'application/json')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@CurrentPlayer() player: Player) {
    return this.authService.login(player)
  }

  @Get('logout')
  @Header('Content-Type', 'application/json')
  async logout(@CurrentPlayer() player: Player) {
    //do whatever stuff is needed when the player logs out
  }

  @Post('register')
  @Header('Content-Type', 'application/json')
  @Public()
  @ApiResponse({ status: 201, type: PlayerDetailDto })
  @Serialize(PlayerDetailDto)
  register(@Body() createPlayerDto: CreatePlayerDto) {
    return this.authService.register(createPlayerDto)
  }
}

registerEntity('AuthController', AuthController)
