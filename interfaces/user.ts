import { User } from '@prisma/client';
import { IBook } from './book';

export interface IUser extends User {}

export type IUserWithBooks = User & {
  books: IBook[];
};
