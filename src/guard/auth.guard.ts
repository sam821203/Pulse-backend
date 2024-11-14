import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // 如果沒有權限要求，都可以通過
    if (!roles) return true;
    // switch (context.switchToHttp().getRequest().user) {
    //   case 'user':
    //     return true;
    //   default:
    //     return false;
    // }
    return true;
  }
}
