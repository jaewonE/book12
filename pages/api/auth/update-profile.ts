import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { use } from 'react';
import { hashPassword } from '../../../lib/auth';
import {
  deleteFileFB,
  EUploadImageFBType,
  uploadImageFB,
} from '../../../lib/firebase';
import prisma from '../../../lib/prisma';

interface IProfileProps {
  email?: string;
  password?: string;
  name?: string;
  coverImg?: string;
  fileDataURL?: string;
}

interface IProfileRes {
  status: boolean;
  error?: string;
  warning?: string;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IProfileRes>
) {
  try {
    let warning: string | undefined = undefined;

    if (req.method !== 'POST') throw new Error('Method POST is vaild');
    const { email, password, name, coverImg, fileDataURL }: IProfileProps =
      req.body;
    if (email || password || name || fileDataURL || !coverImg) {
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
      if (email && email !== user.email) {
        const hasUser = await prisma.user.findUnique({
          where: { email },
        });
        if (hasUser) throw new Error(`Email with ${email} already exists.`);
        user.email = email;
      }

      if (fileDataURL) {
        if (user.coverImg) {
          const hasDeleted = await deleteFileFB({ coverImg: user.coverImg });
          if (!hasDeleted) {
            throw new Error('Can not delete original cover image');
          }
        }
        const imageURL = await uploadImageFB({
          fileDataURL,
          type: EUploadImageFBType.USER,
        });
        if (imageURL) user.coverImg = imageURL;
        else warning = '[Error] Can not upload image';
      } else {
        if (user.coverImg && !coverImg) {
          const hasDeleted = await deleteFileFB({ coverImg: user.coverImg });
          if (hasDeleted) user.coverImg = null;
          else throw new Error('Can not delete original cover image');
        }
      }

      await prisma.user.update({
        where: { email: session.user.email },
        data: { ...user },
      });
    }
    res.status(201).json({ status: true, warning });
  } catch (error: string | any | unknown) {
    res.status(422).send({ status: false, error: String(error).slice(7) });
  }
}
