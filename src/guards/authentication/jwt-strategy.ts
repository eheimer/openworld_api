import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '../../constants'
import { PlayersService } from '../../players/players.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private playersService: PlayersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: any) {
    //for subsequent requests, I think this is what gets put into req.user
    return await this.playersService.findOne(payload.sub)
  }
}
