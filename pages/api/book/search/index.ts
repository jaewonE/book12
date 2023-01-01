import type { NextApiRequest, NextApiResponse } from 'next';
import { IBookWithRelationName } from '../../../../interfaces/book';
import prisma from '../../../../lib/prisma';

export interface ISearchPageProps {
  term: string;
  page: number;
  books: IBookWithRelationName[];
}

export interface IAxiosSearchPageProps {
  status: number;
  data: ISearchPageProps;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISearchPageProps>
) {
  let term = req.query['term'] || '';
  if (Array.isArray(term)) term = term[0];
  const curQueryPage = req.query['page'] || '';
  let curPage: number = Array.isArray(curQueryPage)
    ? +curQueryPage[0]
    : +curQueryPage;
  if (Number.isNaN(curPage) || curPage <= 0) curPage = 1;
  try {
    const books = await prisma.book.findMany({
      ...(term && { where: { title: { contains: term } } }),
      ...(!term && { orderBy: { id: 'desc' } }),
      take: 30,
      skip: (curPage - 1) * 30,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
    if (books.length <= 0) throw new Error('No books');
    res.status(200).json({ books, term, page: curPage });
  } catch (e: any) {
    res.status(404).send({ books: [], term, page: curPage });
  }
}
