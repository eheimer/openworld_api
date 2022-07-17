import User from '../src/api/models/User'

export {}
declare global {
  namespace Express {
    interface Request {
      me?: User
      token?: string
    }
  }
}

// service responses
export type ErrorResponse = {
  error: { type: string; message: number | string }
}
export type AuthResponse = ErrorResponse | { playerId: number | string }
export type CreatePlayerResponse = ErrorResponse | { playerId: number | string }
export type LoginResponse = ErrorResponse | { token: string; player: number | string }

// openapi types
export type APIController = {
  methods: APIMethod
}
export type APIParameter = {
  name: string
  required: boolean
  in: string
  description: string
  schema: { type: string }
}
export type APIResponse = { $ref: string }
export type APIRequest = { $ref: string }
export type APIMethod = {
  path: string
  verb: string
  security: any[]
  summary: string
  description: string
  operationId: string
  tags: string[]
  requestBody: APIRequest
  responses: APIResponse
  parameters: APIParameter[]
  requestObject: string
  responseObject: string
}
