import { useEffect, useState } from 'react';
import ShowBooks from '../components/show-books';
import MainSearch from '../components/main-search';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import { IBookWithRelationName } from '../interfaces/book';

export const getServerSideProps: GetServerSideProps<{
  books: IBookWithRelationName[];
}> = async () => {
  try {
    const books = await prisma.book.findMany({
      take: 20,
      orderBy: {
        id: 'desc',
      },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
    if (books.length <= 0) throw new Error('No books');
    return {
      props: { books: JSON.parse(JSON.stringify(books)) },
    };
  } catch (e: any) {}
  return {
    props: { books: [] },
  };
};

export default function Home({ books }: { books: IBookWithRelationName[] }) {
  const [rBooks] = useState<IBookWithRelationName[]>(books);
  const router = useRouter();
  const onSearch = (term: string): void => {
    if (term) router.push(`/search?term=${term}`);
  };
  const onClickBook = (book: IBookWithRelationName) => {
    router.push(`/detail/${book.id}`);
  };
  useEffect(() => {
    alert('Rebuild test!');
  });
  return (
    <div className="w-full h-full flex flex-col flex-grow ">
      <MainSearch onSearch={onSearch} />
      {books.length > 0 ? (
        <ShowBooks books={rBooks} onClick={onClickBook} />
      ) : (
        <div className="w-full flex flex-grow justify-center items-center font-medium text-3xl text-gray-800">
          No Results
        </div>
      )}
    </div>
  );
}
