import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PlayersService } from '../players/players.service'
import { Public } from 'src/common/public.decorator'
import { LocalAuthGuard } from './local-auth.guard'
import { Player } from '../players/player.entity'
import { CreatePlayerDto } from 'src/players/dto/create-player.dto'

@Controller('auth')
export class AuthController {
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
