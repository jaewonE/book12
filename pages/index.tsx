import { useState } from 'react';
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
      props: { books },
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
  return (
    <div className="w-full">
      <MainSearch onSearch={onSearch} />
      <ShowBooks books={rBooks} onClick={onClickBook} />
    </div>
  );
}
