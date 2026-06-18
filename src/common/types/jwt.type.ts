import type { JwtPayload } from "jsonwebtoken";
import type { UserRoleType } from "./enums.types.js";

export type AuthTokenPayload = {
  id: string;
  role: UserRoleType;
  orgId: string;
  serviceId: string | null;
};

export type JwtAuthTokenPayload = JwtPayload | AuthTokenPayload;
