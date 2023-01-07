import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { IUser } from '../../../interfaces/user';
import { hashPassword, verifyPassword } from '../../../lib/auth';
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
