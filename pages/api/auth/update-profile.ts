import type { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '../../../interfaces/user';
import { hashPassword, verifyPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export interface IProfileProps {
  originEmail: string;
  email?: string;
  originPassword: string;
  password?: string;
  name?: string;
}

export interface IProfileRes {
  status: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IProfileRes>
) {
  try {
    if (req.method !== 'POST') throw new Error('Method POST is vaild');
    const {
      originEmail,
      email,
      originPassword,
      password,
      name,
    }: IProfileProps = req.body;
    if (email || password || name) {
      const user = await prisma.user.findUnique({
        where: { email: originEmail },
      });
      if (!user) throw new Error('Failed to validate user');
      if (user.password !== originPassword)
        throw new Error('Failed to validate user');

      if (password && password !== '')
        user.password = await hashPassword(password);
      if (name && name !== user.name) user.name = name;
      if (email && email !== user.email) {
        const hasUser = await prisma.user.findUnique({
          where: { email },
        });
        if (hasUser) throw new Error(`Email with ${email} already exists.`);
        user.email = email;
      }
      await prisma.user.update({
        where: {
          email: originEmail,
        },
        data: { ...user },
      });
    }
    res.status(201).json({ status: true });
  } catch (error: string | any | unknown) {
    res.status(422).send({ status: false, error: String(error).slice(7) });
  }
}
