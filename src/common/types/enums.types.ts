export const UserRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  STAFF: 'staff',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const TicketStatus = {
  PENDING: "pending",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  NO_SHOW: "noShow",
} as const;

export type TicketStatusType = (typeof TicketStatus)[keyof typeof TicketStatus];
