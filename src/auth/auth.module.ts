import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PlayersModule } from '../players/players.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { jwtConstants } from './constants'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt-strategy'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    PlayersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
