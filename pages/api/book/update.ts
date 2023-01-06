import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { IBook } from '../../../interfaces/book';

interface IUpdateBook {
  status: boolean;
  error?: string;
}

export interface IAxiosUpdateBook {
  status: number;
  data: IUpdateBook;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUpdateBook>
) {
  if (req.method !== 'POST') throw new Error('Method POST is vaild');
  const { title, description, coverImg, id, categoryId, authorId }: IBook =
    req.body;
  try {
    const session = await getSession({ req });
    // @ts-ignore
    const userId: string | null = session?.id;
    if (!userId) throw new Error('Can not varified user. Please log in again');
    if (userId !== authorId)
      throw new Error('Access denied: not an onwer of the book');

    const result = await prisma.book.update({
      where: { id },
      data: { title, description, coverImg, categoryId },
    });
    console.log(result);
    if (!result) throw new Error('Can not update book');
    res.status(201).json({ status: true });
  } catch (e: any) {
    res.status(422).send({ status: false, error: String(e) });
  }
}
