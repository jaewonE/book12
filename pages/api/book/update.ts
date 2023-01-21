import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import {
  deleteFileFB,
  EUploadImageFBType,
  uploadImageFB,
} from '../../../lib/firebase';

interface IUpdateBookProps {
  title?: string;
  description?: string;
  coverImg?: string;
  fileDataURL?: string;
  categoryId?: number;
  bookId: number;
  authorId: string;
}

interface IUpdateBook {
  status: boolean;
  warning?: string;
  error?: string;
}

export interface IAxiosUpdateBook {
  status: number;
  data: IUpdateBook;
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
  res: NextApiResponse<IUpdateBook>
) {
  if (req.method !== 'POST') throw new Error('Method POST is vaild');
  const {
    title,
    description,
    fileDataURL,
    coverImg,
    categoryId,
    bookId,
    authorId,
  }: IUpdateBookProps = req.body;
  try {
    let warning: string | undefined = undefined;
    let newCoverImg: string | undefined = undefined;

    if (title || description || fileDataURL || categoryId) {
      const session = await getSession({ req });
      // @ts-ignore
      const userId: string | null = session?.id;
      if (!userId)
        throw new Error('Can not varified user. Please log in again');
      if (userId !== authorId)
        throw new Error('Access denied: not an onwer of the book');

      if (fileDataURL) {
        if (coverImg) {
          const hasDeleted = await deleteFileFB({ coverImg });
          if (!hasDeleted) {
            throw new Error('Can not delete original cover image');
          }
        }
        const imageURL = await uploadImageFB({
          fileDataURL,
          type: EUploadImageFBType.BOOK,
        });
        if (imageURL) newCoverImg = imageURL;
        else warning = '[Error] Can not upload image';
      }

      const result = await prisma.book.update({
        where: { id: bookId },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(newCoverImg && { coverImg: newCoverImg }),
          ...(categoryId && { categoryId }),
        },
      });
      if (!result) throw new Error('Can not update book');
    }
    res.status(201).json({ status: true, warning });
  } catch (e: any) {
    res.status(422).send({ status: false, error: String(e) });
  }
}
