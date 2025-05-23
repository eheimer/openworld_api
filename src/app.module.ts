import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayersModule } from './players/players.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './guards/authentication/jwt-auth.guard'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GamesModule } from './games/games.module'
import { MonstersModule } from './monsters/monsters.module'
import { ConditionsModule } from './conditions/conditions.module'
import { DamageTypesModule } from './damage-types/damage-types.module'
import { SkillsModule } from './skills/skills.module'
import { RaceModule } from './race/race.module'
import { ItemsModule } from './items/items.module'
import { MapModule } from './map/map.module'
import dbConfig from './config/database'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { UtilsModule } from './utils/utils.module'
import { LoggerMiddleware } from './middleware/logger.middleware'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '_static', 'client'),
      serveRoot: '/mapeditor'
    }),
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
    MonstersModule,
    ConditionsModule,
    DamageTypesModule,
    SkillsModule,
    RaceModule,
    ItemsModule,
    MapModule,
    UtilsModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: 'LoggerMiddleware', useClass: LoggerMiddleware }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'test') {
      consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
  }
}
