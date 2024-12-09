import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY } from '../casl/casl-ability.decorator';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CreateUserDto } from 'src/modules/user/dto';
import { Action } from '../enums/actions.enum';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const abilities = this.reflector.get<[Action, string][]>(
      CHECK_ABILITY,
      context.getHandler(),
    );
    if (!abilities) return true;

    const request = context.switchToHttp().getRequest();
    const user: CreateUserDto = request.user;

    const ability = this.abilityFactory.createForUser(user);

    for (const [action, subject] of abilities) {
      if (!ability.can(action, subject)) {
        throw new ForbiddenException('Forbidden');
      }
    }

    return true;
  }
}
