export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  STAFF: 'staff',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];