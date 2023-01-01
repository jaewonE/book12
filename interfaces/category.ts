import { Category } from '@prisma/client';
import { IBook } from './book';

export interface ICategory extends Category {}

export type CategoryWithBooks = Category & {
  books: IBook[];
};
