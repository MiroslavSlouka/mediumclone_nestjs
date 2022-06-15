import { UserType } from '../types/user.types';

export interface IUserResponse {
  user: UserType & { token: string };
}
