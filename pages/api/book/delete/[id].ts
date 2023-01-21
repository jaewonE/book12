import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { deleteFileFB } from '../../../../lib/firebase';
import prisma from '../../../../lib/prisma';

interface IDeleteAccountRes {
  status: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IDeleteAccountRes>
) {
  try {
    if (req.method !== 'GET') throw new Error('Method GET is vaild');
    const stringId = req.query?.id;
    if (!stringId) throw new Error('Book id not found');
    const id = Array.isArray(stringId) ? Number(stringId[0]) : Number(stringId);

    const session = await getSession({ req });
    // @ts-ignore
    const userId: string | null = session?.id;
    if (!userId) throw new Error('Can not varified user. Please log in again');

    const hasBook = await prisma.book.findUnique({ where: { id } });
    if (!hasBook) throw new Error('Book not found');
    if (hasBook.authorId !== userId)
      throw new Error('Access denied: not an onwer of the book');

    if (hasBook.coverImg) {
      const hasDeletedCoverImg = await deleteFileFB({
        coverImg: hasBook.coverImg,
      });
      if (!hasDeletedCoverImg)
        console.error(`Can noy delete file: ${hasBook.coverImg}`);
    }

    const deleteBook = await prisma.book.delete({ where: { id } });
    if (deleteBook) {
      res.status(200).json({ status: true });
      return;
    }
    throw new Error('');
  } catch (error: string | any | unknown) {
    res.status(422).send({ status: false, error: String(error).slice(7) });
  }
}
