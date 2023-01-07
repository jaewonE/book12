import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../../components/loader';
import BookSvg from '../../components/svg/book';
import { IBookWithRelation } from '../../interfaces/book';
import prisma from '../../lib/prisma';

interface IDetailPage {
  book: IBookWithRelation;
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<IDetailPage> = async (
  ctx: GetStaticPropsContext
) => {
  try {
    if (ctx.params?.id) {
      const bookId: number = +ctx.params.id;
      if (Number.isNaN(bookId) || !Number.isInteger(bookId))
        throw new Error('Wrong params');
      const book = await prisma.book.findUnique({
        where: {
          id: bookId,
        },
        include: {
          author: true,
          category: true,
        },
      });
      if (!book) throw new Error('Book not found');
      return {
        props: {
          book: JSON.parse(JSON.stringify(book)),
        },
      };
    }
  } catch (e: any) {}
  return { notFound: true };
};

export default function DetailPage({ book }: IDetailPage) {
  const { data: session, status } = useSession();

  if (!book) return <Loader />;
  return (
    <div className="mt-16 w-full flex flex-col md:flex-row justify-start items-center">
      <div className="w-1/2 relative flex flex-col justify-center items-center">
        {book.coverImg ? (
          <Image
            className="relative rounded-xl shadow-xl md:max-w-[17rem] lg:max-w-none min-w-[200px]"
            src={book.coverImg}
            alt={book.title}
            priority={true}
            width={330}
            height={550}
          />
        ) : (
          <BookSvg className="w-[250px] h-[330px] relative rounded-3xl shadow-xl" />
        )}
        {status === 'authenticated' &&
          session.user?.email === book.author.email && (
            <Link
              className="w-[17rem] py-1 bg-green-500 text-white rounded-lg text-center mt-6 font-semibold"
              href={`/update-book/${book.id}`}
            >
              Update/Delete
            </Link>
          )}
      </div>
      <div className="mt-10 md:mb-16 px-12 md:pl-0 md:pr-5 w-full md:w-1/2 flex flex-col justify-start items-start border-2 border-t-2 border-gray-900">
        <span className="font-semibold text-3xl">{book.title}</span>
        <span className="font-medium text-xl mt-1 text-gray-600">
          {book.category.name} | {book.author.name}
        </span>
      </div>
    </div>
  );
}
