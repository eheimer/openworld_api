import User from '../src/api/models/User';

export {};
declare global {
  namespace Express {
    interface Request {
      me?: User;
      token?: string;
    }
  }
}

// service responses
export type ErrorResponse = {
  error: { type: string; message: number | string };
};
export type AuthResponse = ErrorResponse | { playerId: number | string };
export type CreatePlayerResponse =
  | ErrorResponse
  | { playerId: number | string };
export type LoginResponse =
  | ErrorResponse
  | { token: string; player: number | string };
