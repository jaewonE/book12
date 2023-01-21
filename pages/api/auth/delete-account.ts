import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { deleteFileFB } from '../../../lib/firebase';
import prisma from '../../../lib/prisma';

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
    const session = await getSession({ req });
    const email = session?.user?.email;
    if (!email) throw new Error('Failed to validate user. please log in again');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Failed to validate user. please log in again');

    if (user.coverImg) {
      const hasDeletedCoverImg = await deleteFileFB({
        coverImg: user.coverImg,
      });
      if (!hasDeletedCoverImg)
        console.error(`Can noy delete file: ${user.coverImg}`);
    }

    const bookCoverImgList = await prisma.book
      .findMany({
        where: { authorId: user.id },
        select: { coverImg: true },
      })
      .then((list) => {
        return list.map(({ coverImg }) => {
          if (coverImg) return Promise.resolve(deleteFileFB({ coverImg }));
          return Promise.resolve(true);
        });
      });
    await Promise.all(bookCoverImgList);

    const deleteUser = await prisma.user.delete({ where: { email } });
    if (deleteUser) {
      res.status(200).json({ status: true });
      return;
    }
    throw new Error('');
  } catch (error: string | any | unknown) {
    res.status(422).send({ status: false, error: String(error).slice(7) });
  }
}
