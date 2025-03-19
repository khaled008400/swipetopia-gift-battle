
import { UserRole } from '@/types/auth.types';

export const hasRole = (userRoles: UserRole[] | undefined, role: string): boolean => {
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.includes(role as UserRole);
};

export const isAdmin = (userRoles: UserRole[] | undefined): boolean => {
  return hasRole(userRoles, 'admin');
};
