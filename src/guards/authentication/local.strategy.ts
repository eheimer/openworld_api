import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from "../../auth/auth.service"
import { getEntity, registerEntity } from "../../entityRegistry"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.authenticate(username, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}

registerEntity('LocalStrategy', LocalStrategy)
