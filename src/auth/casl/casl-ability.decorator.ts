import { SetMetadata } from '@nestjs/common';

export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...abilities: [string, string][]) =>
  SetMetadata(CHECK_ABILITY, abilities);
