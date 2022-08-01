import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PlayersService } from '../players/players.service'
import { Public } from 'src/decorators/public-auth.decorator'
import { LocalAuthGuard } from './local-auth.guard'
import { Player } from '../players/player.entity'
import { CreatePlayerDto } from 'src/players/dto/create-player.dto'
import { CurrentUser } from 'src/decorators/current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private playersService: PlayersService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@CurrentUser() player: Player) {
    return this.authService.login(player)
  }

  @Get('logout')
  async logout(@CurrentUser() player: Player) {
    //do whatever stuff is needed when the player logs out
  }

  @Post('register')
  @Public()
  register(@Body() body: CreatePlayerDto) {
    console.log('here')
    return this.authService.register(body.username, body.email, body.password)
  }
}
