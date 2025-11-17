import { Injectable, NestMiddleware, RequestMethod } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly reflector: Reflector) {}
  private readonly routeMap = global['routeMap']

  use(req: Request, res: Response, next: NextFunction) {
    const { method, path: url } = req
    const fixedPath = this.fixPath(url)
    let operation = this.routeMap[url]?.[method.toLowerCase()]
    if (fixedPath != url) {
      //loop through the routeMap and find the first match that contains the method
      const key = Object.keys(this.routeMap).find((route) => {
        const fixedRoute = route.replace(/{\w+}/g, '{}')
        return fixedRoute == fixedPath && this.routeMap[route]?.[method.toLowerCase()]
      })
      operation = this.routeMap[key]?.[method.toLowerCase()]
    }
    const controller = operation?.operationId?.split('_')[0] || 'Unknown Controller'

    Logger.debug(`${method} ${url}`, `${controller}`)

    Logger.verbose(`Request body: ${JSON.stringify(req.body, null, 2)}`, 'LoggerMiddleware')

    if (next) {
      next()
    }
  }

  fixPath(path) {
    // if any part of the path is a number, replace it with {}
    // this allows us to match paths like /players/1234 to /players/{id}
    const parts = path.split('/')
    const newPath = parts.map((part) => (isNaN(parseInt(part)) ? part : '{}')).join('/')
    return newPath
  }
}

(globalThis as any).LoggerMiddleware = LoggerMiddleware
