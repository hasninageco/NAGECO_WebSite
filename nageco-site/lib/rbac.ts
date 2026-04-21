import type { Role } from "@prisma/client";

const roleRank: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3
};

export function hasMinRole(userRole: Role, requiredRole: Role) {
  return roleRank[userRole] >= roleRank[requiredRole];
}

export function canAccess(userRole: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(userRole);
}