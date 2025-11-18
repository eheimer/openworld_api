import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlayersModule } from "./players/players.module.js"
import { AuthModule } from "./auth/auth.module.js"
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from "./guards/authentication/jwt-auth.guard.js"
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GamesModule } from "./games/games.module.js"
import { MonstersModule } from "./monsters/monsters.module.js"
import { ConditionsModule } from "./conditions/conditions.module.js"
import { DamageTypesModule } from "./damage-types/damage-types.module.js"
import { SkillsModule } from "./skills/skills.module.js"
import { RaceModule } from "./race/race.module.js"
import { ItemsModule } from "./items/items.module.js"
import { MapModule } from "./map/map.module.js"
import dbConfig from "./config/database.js"
import { ServeStaticModule } from '@nestjs/serve-static'
import path, { join } from 'path'
import { UtilsModule } from "./utils/utils.module.js"
import { LoggerMiddleware } from "./middleware/logger.middleware.js"
import { fileURLToPath } from 'url'
import { getEntity, registerEntity } from "./entityRegistry.js"


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(path.dirname(fileURLToPath(new URL(import.meta.url))), '_static', 'client'),
      serveRoot: '/mapeditor'
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/.env.${process.env.NODE_ENV}.js`,
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

registerEntity('AppModule', AppModule)
