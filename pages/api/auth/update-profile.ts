import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { hashPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

interface IProfileProps {
  email?: string;
  password?: string;
  name?: string;
  coverImg?: string;
}

interface IProfileRes {
  status: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IProfileRes>
) {
  try {
    if (req.method !== 'POST') throw new Error('Method POST is vaild');
    const { email, password, name, coverImg }: IProfileProps = req.body;
    if (email || password || name || coverImg) {
      const session = await getSession({ req });
      if (!session?.user?.email)
        throw new Error('Failed to validate user. please log in again');
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (!user)
        throw new Error('Failed to validate user. please log in again');

      if (password && password !== '')
        user.password = await hashPassword(password);
      if (name && name !== user.name) user.name = name;
      if (coverImg && coverImg !== user.coverImg) user.coverImg = coverImg;
      if (email && email !== user.email) {
        const hasUser = await prisma.user.findUnique({
          where: { email },
        });
        if (hasUser) throw new Error(`Email with ${email} already exists.`);
        user.email = email;
      }
      await prisma.user.update({
        where: { email: session.user.email },
        data: { ...user },
      });
    }
    res.status(201).json({ status: true });
  } catch (error: string | any | unknown) {
    res.status(422).send({ status: false, error: String(error).slice(7) });
  }
}
