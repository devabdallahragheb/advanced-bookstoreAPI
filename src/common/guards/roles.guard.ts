// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import RequestWithUser from '../types/request-with-user.type';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly _reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const roles = this._reflector.get<string[]>('roles', context.getHandler());

//     if (!roles) return true;

//     const request = context.switchToHttp().getRequest() as RequestWithUser;
//     const { role } = request.user;

//     return roles.includes(role);
//   }
// }
