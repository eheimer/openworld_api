import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { CreatePlayerDto } from './players/dto/create-player.dto'
import { PlayersService } from './players/players.service'
import { Public } from './common/public.decorator'
import { Player } from './players/player.entity'
import { LocalAuthGuard } from './auth/local-auth.guard'

@Controller('/auth')
export class AppController {
  constructor(private authService: AuthService, private playersService: PlayersService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Get('logout')
  async logout(@Request() req) {
    const player = req.user as Player
    //do whatever stuff is needed when the player logs out
  }

  @Post('register')
  @Public()
  register(@Body() body: CreatePlayerDto) {
    console.log('here')
    return this.authService.register(body.username, body.email, body.password)
  }
}
