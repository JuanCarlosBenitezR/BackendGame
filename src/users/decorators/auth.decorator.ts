import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../interfaces/user-role.interface';
import { RolProtected } from './rol-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-rol/user-rol.guard';

export function Auth(...args: UserRole[]) {
  return applyDecorators(
    RolProtected(...args),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
