import { Module } from '@nestjs/common'
import { AuthService } from "./auth.service"
import { PlayersModule } from "../players/players.module"
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from "../guards/authentication/local.strategy"
import { jwtConstants } from "../constants"
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from "../guards/authentication/jwt-strategy"
import { AuthController } from "./auth.controller"

@Module({
  imports: [
    PlayersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}

