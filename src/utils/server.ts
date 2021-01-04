import bodyParser from 'body-parser'
import express, { Handler } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { Express } from 'express-serve-static-core'
import morgan from 'morgan'
import morganBody from 'morgan-body'
import { UserFactory } from '../../src/api/factories/UserFactory'
import { connector, summarise } from 'swagger-routes-express'
import YAML from 'yamljs'

import * as api from '../api/controllers'
import config from '../config'
import { expressDevLogger } from '../utils/express_dev_logger'
import logger from '../utils/logger'

export const routes = {}

export function makeRoutePath(route: string, props: any): string {
    let path = ''
    if (routes[route]) {
        path = routes[route]
        for (let prop in props) {
            path = path.replace(`:${prop}`,props[prop])
        }
    }
    return path
}

export async function createServer(): Promise<Express> {
    const yamlSpecFile = './config/openapi.yml'
    const apiDefinition = YAML.load(yamlSpecFile)
    const apiSummary = summarise(apiDefinition)
    logger.info(apiSummary)

    const server = express()

    //will need this later for the socket.io stuff
    const httpServer = require('http').createServer(server)

    // middleware
    server.use(bodyParser.json())
    /* istanbul ignore next */
    if (config.morganLogger) {
        server.use(morgan(':method :url :status :response-time ms - :res[content-length]') as Handler);
    }
    /* istanbul ignore next */
    if (config.morganBodyLogger) {
        morganBody(server)
    }
    /* istanbul ignore next */
    if (config.openworldDevLogger) {
        server.use(expressDevLogger)
    }

    // setup API validator
    const validatorOptions = {
        apiSpec: yamlSpecFile,
        validateRequests: true,
        validateResponses: true
    }

    server.use(OpenApiValidator.middleware(validatorOptions))

    // attach player and token to request, if possible
    server.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { player, token } = req.body
        if (player) {
            req.me = await new UserFactory().getRepository().findOne(player);
        }
        req.token = token
        logger.verbose(`${req.method}: ${req.url}, params: ${JSON.stringify(req.params)}, body: ${JSON.stringify(req.body)}`)
        next()
    })

    // error customization, if request is invalid
    server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status).json({
            error: {
                type: 'request_validation',
                message: err.message,
                errors: err.errors
            }
        })
    })

    const connect = connector(api, apiDefinition, {
        onCreateRoute: (method: string, descriptor: any[]) => {
            const [path, ...handlers] = descriptor
            const handlerName = handlers[handlers.length - 1].name
            if (handlerName !== 'notImplemented' && handlerName !== 'notFound' && handlerName !== 'auth') {
                routes[handlerName] = path
            }
            logger.verbose(`${method}: ${handlers.map((d: any) => d.name).join(', ')}`)
        },
        security: {
            bearerAuth: api.auth
        }
    })

    connect(server)

    return server
}