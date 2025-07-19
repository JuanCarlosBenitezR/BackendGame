import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../interfaces/user-role.interface';

export const META_ROLES = 'roles';
export const RolProtected = (...args: UserRole[]) => {
  return SetMetadata(META_ROLES, args);
};
