import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json, urlencoded } from 'express'
import * as fs from 'fs'
import { AppModule } from './app.module'

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
  const routeMap = Object.keys(swaggerDocument.paths).reduce((acc, path) => {
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
  Logger.log(`Route map generated: ${JSON.stringify(routeMap)}`, 'Swagger')

  function fixPath(path) {
    // if any part of the path is a number, replace it with {}
    // this allows us to match paths like /players/1234 to /players/{id}
    const parts = path.split('/')
    const newPath = parts.map((part) => (isNaN(parseInt(part)) ? part : '{}')).join('/')
    return newPath
  }

  // log all requests
  app.use((req, res, next) => {
    const { method, path: url } = req
    const fixedPath = fixPath(url)
    let operation = routeMap[url]?.[method.toLowerCase()]
    if (fixedPath != url) {
      //loop through the routeMap and find the first match that contains the method
      const key = Object.keys(routeMap).find((route) => {
        const fixedRoute = route.replace(/{\w+}/g, '{}')
        return fixedRoute == fixedPath && routeMap[route]?.[method.toLowerCase()]
      })
      operation = routeMap[key]?.[method.toLowerCase()]
    }
    // const controller = operation?.operationId?.replace('_', '.') || 'Unknown Controller'
    const controller = operation?.operationId?.split('_')[0] || 'Unknown Controller'
    Logger.debug(`${method} ${url}`, `${controller}`)
    next()
  })

  await app.listen(3000)
}
bootstrap()
