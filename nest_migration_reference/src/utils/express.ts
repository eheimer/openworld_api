import * as express from 'express'
import { OutgoingHttpHeaders } from 'http'

export function writeJsonResponse(
  res: express.Response,
  code: any,
  payload: any,
  headers?: OutgoingHttpHeaders | undefined
): void {
  const data = typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload
  res.writeHead(code, { ...headers, 'Content-Type': 'application/json' })
  res.end(data)
}

export function INTERNAL_SERVER_ERROR(res: express.Response, message: any): void {
  writeJsonResponse(res, 500, {
    error: { type: 'internal_server_error', message }
  })
}

export function UNAUTHORIZED(res: express.Response, message?: any): void {
  writeJsonResponse(res, 401, {
    error: { type: 'authorization_failed', message }
  })
}

export function CREATED(res: express.Response, location: string): void {
  res.setHeader('Location', location)
  writeJsonResponse(res, 201, null)
}

export function OK(res: express.Response, payload: any, headers?: OutgoingHttpHeaders | undefined): void {
  writeJsonResponse(res, 200, payload, headers)
}

export function HTML_OK(res: express.Response, body: any, headers?: OutgoingHttpHeaders | undefined): void {
  res.writeHead(200, { ...headers, 'Content-Type': 'text/html' })
  res.end(body)
}

export function NOT_FOUND(res: express.Response, message?: any): void {
  writeJsonResponse(res, 404, {
    error: { type: 'not_found', message }
  })
}

export function NO_CONTENT(res: express.Response): void {
  writeJsonResponse(res, 204, {})
}

export function CONFLICT(res: express.Response, message?: any): void {
  writeJsonResponse(res, 409, {
    error: { type: 'conflict', message }
  })
}
