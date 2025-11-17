import { Module } from '@nestjs/common'
import { AuthService } from "./auth.service.js"
import { PlayersModule } from "../players/players.module.js"
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from "../guards/authentication/local.strategy.js"
import { jwtConstants } from "../constants.js"
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from "../guards/authentication/jwt-strategy.js"
import { AuthController } from "./auth.controller.js"

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

(globalThis as any).AuthModule = AuthModule
