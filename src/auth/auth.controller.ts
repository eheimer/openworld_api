import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PlayersService } from '../players/players.service'
import { Public } from 'src/decorators/public-auth.decorator'
import { LocalAuthGuard } from '../guards/authentication/local-auth.guard'
import { Player } from '../players/entities/player.entity'
import { CreatePlayerDto } from 'src/players/dto/create-player.dto'
import { CurrentPlayer } from 'src/decorators/current-player.decorator'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { PlayerDetailDto } from '../players/dto/player-detail.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService, private playersService: PlayersService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@CurrentPlayer() player: Player) {
    return this.authService.login(player)
  }

  @Get('logout')
  async logout(@CurrentPlayer() player: Player) {
    //do whatever stuff is needed when the player logs out
  }

  @Post('register')
  @Public()
  @ApiResponse({ status: 201, type: PlayerDetailDto })
  @Serialize(PlayerDetailDto)
  register(@Body() createPlayerDto: CreatePlayerDto) {
    return this.authService.register(createPlayerDto)
  }
}
