import type { AuthTokenPayload } from "./jwt.type.ts";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthTokenPayload;
    }
  }
}
