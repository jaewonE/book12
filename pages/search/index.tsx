import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SearchMain from '../../components/main-search';
import ShowBooks from '../../components/show-books';
import { IBookWithRelationName } from '../../interfaces/book';
import prisma from '../../lib/prisma';

interface ISearchPageProps {
  term: string;
  page: number;
  books: any[];
}

export const getServerSideProps: GetServerSideProps<ISearchPageProps> = async ({
  query,
}: any) => {
  let term = query['term'] || '';
  if (Array.isArray(term)) term = term[0];
  const curQueryPage = query['page'] || '';
  let curPage: number = Array.isArray(curQueryPage)
    ? +curQueryPage[0]
    : +curQueryPage;
  if (Number.isNaN(curPage) || curPage <= 0) curPage = 1;
  try {
    // const { data, status }: IAxiosSearchPageProps = await axios.get(
    //   `http://localhost:3000/api/book/search?term=${query['term'] || ''}${
    //     `&page=${query['page']}` || ''
    //   }`
    // );
    const books = await prisma.book.findMany({
      ...(term && { where: { title: { contains: term } } }),
      ...(!term && { orderBy: { id: 'desc' } }),
      take: 30,
      skip: (curPage - 1) * 30,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
    if (books.length > 0) return { props: { books, term, page: curPage } };
  } catch (e) {}
  return {
    props: { books: [], term, page: curPage },
  };
};

export default function SearchPage({ books, term, page }: ISearchPageProps) {
  const [rBooks, setRBooks] = useState<IBookWithRelationName[]>(books);
  const router = useRouter();
  useEffect(() => {
    setRBooks(books);
  }, [books]);

  const onSearch = async (term: string): Promise<void> => {
    router.push(`/search${term && `?term=${term}`}`);
  };
  const onClickBook = (book: IBookWithRelationName) => {
    router.push(`/detail/${book.id}`);
  };

  return (
    <>
      <SearchMain onSearch={onSearch} defaultValue={term} />
      {rBooks.length ? (
        <ShowBooks books={rBooks} onClick={onClickBook} />
      ) : (
        <div className="w-full flex flex-grow justify-center items-center font-medium text-3xl text-gray-800">
          No Results
        </div>
      )}
    </>
  );
}
