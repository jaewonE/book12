import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ShowBooks from '../components/show-books';
import WrongPath from '../components/wrong-path';
import { IBookWithRelationName } from '../interfaces/book';
import prisma from '../lib/prisma';
import { requireLogIn } from '../props/wrong-path';
import ProfileSvg from '../components/svg/profile';

interface IDashboardProps {
  session?: Session;
  books?: IBookWithRelationName[];
  error?: string;
}

export const getServerSideProps: GetServerSideProps<IDashboardProps> = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const session = await getSession(ctx);
    // @ts-ignore
    if (!session || !session.id) throw new Error('user not found');
    // @ts-ignore
    const authorId: string = session.id;
    const books = await prisma.book.findMany({
      where: { authorId },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
    if (!books) throw new Error('Unexpected error from dashboard');
    return {
      props: JSON.parse(JSON.stringify({ books, session })),
    };
  } catch (e) {
    const error = String(e);
    return {
      props: { error },
    };
  }
};

export default function Dashboard({ books, error, session }: IDashboardProps) {
  const router = useRouter();

  const onClickBook = (book: IBookWithRelationName) => {
    router.push(`/detail/${book.id}`);
  };

  if (!session?.user || !books || error) {
    signOut();
    alert(error);
    console.error(error);
    router.replace('/');
    return <WrongPath props={requireLogIn} />;
  }
  return (
    <div className="w-full flex-grow flex justify-center items-center py-8 2xl:py-0 bg-gray-100">
      <div className="w-[28rem] sm:w-[90%] max-w-[85rem] min-h-[31rem] py-6 border-4 border-gray-700 shadow-2xl rounded-xl flex flex-col justify-start items-start bg-gray-50">
        <div className="w-full px-6 h-28 flex justify-between items-center border-b border-solid border-gray-200 overflow-y-hidden">
          <div className="h-full flex justify-start items-center pl-2">
            {session.user.image ? (
              <Image
                src={session.user.image}
                className="rounded-full border-2 border-gray-300 border-solid"
                alt="profile"
                width={85}
                height={85}
                priority={true}
              />
            ) : (
              <ProfileSvg
                fill="rgb(156 163 175)"
                className="w-[85px] h-[85px] border-2 border-gray-300 border-solid p-1 pb-0 rounded-full"
              />
            )}
            <div className="w-36 pl-4 ml-2 pb-1 h-full flex flex-col justify-center items-start">
              <span className="text-sm font-semibold">{session.user.name}</span>
              <span className="text-sm text-gray-500 break-all mt-[1px]">
                {session.user.email}
              </span>
            </div>
          </div>
          <div className="h-full flex flex-col justify-center items-center pr-6">
            <div className="text-base font-medium">{books.length}</div>
            <div className="text-sm mt-[1px] text-gray-500">Uploads</div>
          </div>
        </div>
        <div className="my-3 md:pt-[6px] md:pb-0 px-7 w-full flex justify-end items-start">
          <button
            onClick={() => router.push('/add-book')}
            className="px-2 py-1 md:px-3 rounded-md bg-green-500 text-white font-medium text-sm md:text-md md:font-semibold"
          >
            Add Book
          </button>
        </div>
        <ShowBooks books={books} onClick={onClickBook} />
      </div>
    </div>
  );
}
