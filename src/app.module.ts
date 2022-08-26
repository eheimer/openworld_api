import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayersModule } from './players/players.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './guards/authentication/jwt-auth.guard'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GamesModule } from './games/games.module'
import { CharactersModule } from './characters/characters.module'
import { MonstersModule } from './monsters/monsters.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [`${__dirname}/**/*.entity{.ts,.js}`]
        }
      }
    }),
    PlayersModule,
    AuthModule,
    GamesModule,
    CharactersModule,
    MonstersModule
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
