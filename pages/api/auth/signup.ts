import type { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '../../../interfaces/user';
import { hashPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export interface ISignUpProps {
  email: string;
  password: string;
  name: string;
}

export interface ISignUpRes {
  status: boolean;
  error?: string;
  user?: IUser;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISignUpRes>
) {
  try {
    if (req.method !== 'POST') throw new Error('Method POST is vaild');
    const { email, password, name }: ISignUpProps = req.body;
    const hasUser = await prisma.user.findUnique({
      where: { email },
    });
    if (hasUser) throw new Error(`Email with ${email} already exists.`);
    const hashPw = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashPw, name },
    });
    if (!user) throw new Error('Unexpected error');
    res.status(201).json({ status: true, user });
  } catch (error: string | any | unknown) {
    res.status(422).send({ status: false, error: String(error).slice(7) });
  }
}
