import { Profile } from './nav-items';

export interface CurrentUser {
  readonly id: string;
  readonly profile: Profile;
}

export const CURRENT_USER: CurrentUser = { id: 'local-superadmin', profile: 'superadmin' };
