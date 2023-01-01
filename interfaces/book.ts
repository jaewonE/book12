import { Book } from '@prisma/client';
import { ICategory } from './category';
import { IUser } from './user';

export interface IBook extends Book {}

export type IBookWithUser = Book & {
  author: IUser;
};

export type IBookWithCategory = Book & {
  category: ICategory;
};

export type IBookWithRelation = Book & {
  category: ICategory;
  author: IUser;
};

export type IBookWithRelationName = Book & {
  author: Pick<IUser, 'name'>;
  category: Pick<ICategory, 'name'>;
};
