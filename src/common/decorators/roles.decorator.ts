import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../constants/role-type.constant';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
