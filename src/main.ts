import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json, urlencoded } from 'express'
import * as fs from 'fs'
import { AppModule } from "./app.module.js"

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

  // map the swaggerDocument into an object that can be used to look up
  // the controller name and operationId for a given path and method
  // attaching to the global namespace is not recommended, but it's the
  // easiest way to make this data available to the logger middleware
  global['routeMap'] = Object.keys(swaggerDocument.paths).reduce((acc, path) => {
    const pathItem = swaggerDocument.paths[path]
    const methods = Object.keys(pathItem)
    const methodMap = methods.reduce((acc, method) => {
      const operation = pathItem[method]
      acc[method] = operation
      return acc
    }, {})
    acc[path] = methodMap
    return acc
  }, {})

  await app.listen(3000)
}
bootstrap()
