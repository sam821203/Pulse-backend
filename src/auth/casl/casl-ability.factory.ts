import {
  PureAbility,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../modules/user/entities/user.entity';
import { ClientRole } from '../enums/roles.enum';
import { userHasAnyRole } from '../helpers/auth.helpers';
import { Action } from '../enums/actions.enum';

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  // 在註冊使用者時，賦予使用者不同的權限
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (userHasAnyRole(user, [ClientRole.Admin])) {
      // 可以對所有主題進行所有動作
      can(Action.Manage, 'all');
    } else {
      // read-only access to everything
      can(Action.Read, 'all');
    }

    can(Action.Update, User, { id: user.id });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
