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
import { ConditionsModule } from './conditions/conditions.module'
import { DamageTypesModule } from './damage-types/damage-types.module'
import { SkillsModule } from './skills/skills.module'
import { BattlesModule } from './battles/battles.module'
import { RaceModule } from './race/race.module'
import dbConfig from './config/database'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.env.${process.env.NODE_ENV}`,
      load: [dbConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get('db')
      }
    }),
    PlayersModule,
    AuthModule,
    GamesModule,
    CharactersModule,
    MonstersModule,
    ConditionsModule,
    DamageTypesModule,
    SkillsModule,
    BattlesModule,
    RaceModule
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
