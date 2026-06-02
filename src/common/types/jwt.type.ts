import type { JwtPayload } from "jsonwebtoken";
import type { UserRoleType } from "./enums.types.js";

export interface AuthTokenPayload extends JwtPayload {
  id: string;
  role: UserRoleType;
  orgId: String
}
