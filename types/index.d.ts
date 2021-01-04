import User from "../src/api/models/User"

export { }
declare global {
    namespace Express {
        interface Request {
            me?: User
            token?: string
        }
    }
}

// service responses
export type ErrorResponse = { error: { type: string, message: string } }
export type AuthResponse = ErrorResponse | { playerId: string }
export type CreatePlayerResponse = ErrorResponse | { playerId: string }
export type LoginResponse = ErrorResponse | { token: string, player: string }
