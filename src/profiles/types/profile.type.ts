import { UserType } from '@app/users/types/user.types';

export type ProfileType = UserType & { following: boolean };
