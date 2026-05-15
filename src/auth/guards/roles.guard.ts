import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
// import { User } from '../../users/entities/user.entity';
import { ROLES_METEDATA_KEY } from '../decorators/roles.decorator';
import { ClientRole } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private refector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 取得處理程序和類別上的角色元數據
    const requiredClientRoles = this.refector.getAllAndOverride<
      ClientRole[] | undefined
    >(ROLES_METEDATA_KEY, [context.getHandler(), context.getClass()]);

    // 如果沒有設置角色或角色數組為空，則允許請求通過
    if (!requiredClientRoles || requiredClientRoles.length === 0) return true;

    // 取得當前請求的使用者
    const req = context.switchToHttp().getRequest();
    const user: Partial<any> = req.user;

    // 檢查使用者是否具有所需的角色。如果使用者的角色包含在所需角色中，則允許請求通過；否則，拒絕請求
    return (user.roles ?? []).some((role) =>
      requiredClientRoles.includes(role.name),
    );
  }
}
