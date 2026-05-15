import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
  MongoQuery,
  Subject,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
// import { User } from '../../modules/user/entities/user.entity';
import { ClientRole } from '../enums/roles.enum';
import { userHasAnyRole } from '../helpers/auth.helpers';
import { Action } from '../enums/actions.enum';

// type Subjects = InferSubjects<typeof User> | 'all';
type PossibleAbilities = [string, Subject];
type Conditions = MongoQuery;

// const ability = createMongoAbility<PossibleAbilities, Conditions>();
// export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  // 在註冊使用者時，賦予使用者不同的權限
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );
    // 使用者可以更新和閱讀自己的文章
    // can([Action.Read, Action.Update], User, { id: user.id });
    can(Action.Read, 'all', { authorId: user.id });

    // Admins
    if (userHasAnyRole(user, [ClientRole.Admin])) {
      // 可以對所有主題進行所有動作
      can(Action.Manage, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }
}
