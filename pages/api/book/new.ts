import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ICategory } from '../../../interfaces/category';
import { EUploadImageFBType, uploadImageFB } from '../../../lib/firebase';
import prisma from '../../../lib/prisma';

export interface INewBookProps {
  title: string;
  description: string;
  category: ICategory;
  fileDataURL?: string;
}

interface INewBook {
  status: boolean;
  warning?: string;
  error?: string;
}

export interface IAxiosNewBook {
  status: number;
  data: INewBook;
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
  res: NextApiResponse<INewBook>
) {
  if (req.method !== 'POST') throw new Error('Method POST is vaild');
  const { title, description, category, fileDataURL }: INewBookProps = req.body;
  if (!title || !description || !category)
    throw new Error('Lack of essential elements');
  try {
    const session = await getSession({ req });
    // @ts-ignore
    const userId: string | null = session?.id;
    if (!userId) throw new Error('Can not varified user. Please log in again');

    let coverImg: string | null = null;
    let warning: string | undefined = undefined;
    if (fileDataURL) {
      coverImg = await uploadImageFB({
        fileDataURL,
        type: EUploadImageFBType.BOOK,
      });
      if (!coverImg) warning = '[Error] Can not upload image';
    }
    const result = await prisma.book.create({
      data: {
        title,
        description,
        coverImg,
        category: { connect: { id: category.id } },
        author: { connect: { id: userId } },
      },
    });
    if (!result) throw new Error('Can not add book');
    res.status(201).json({ status: true, warning });
  } catch (e: any) {
    res.status(422).send({ status: false, error: String(e) });
  }
}
