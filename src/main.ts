import { ValidationPipe, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import { json, urlencoded } from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Openworld API')
    .setDescription('Backend API for Openworld')
    .setVersion('1.0.0')
    .setLicense('All Rights Reserved', undefined)
    .addServer('http://localhost:3000')
    .addTag('auth')
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  fs.writeFileSync('dist/openapi.json', JSON.stringify(swaggerDocument, null, 2))
  Logger.log('OpenAPI spec written to dist/openapi.json', 'Swagger')

  SwaggerModule.setup('api', app, swaggerDocument)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(3000)
}
bootstrap()
