import { AuthTokenPayload } from "./jwt.types.js";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: UserRoleType;
        orgId: string;
      };
    }
  }
}
