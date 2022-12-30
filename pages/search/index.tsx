import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../../components/loader';
import SearchMain from '../../components/main-search';
import ShowBooks from '../../components/show-books';
import { IAxiosBookListRes, IBook } from '../../interfaces/book';

export default function SearchPage({ term }: { term?: string }) {
  const [rBooks, setRBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:4000/books${term ? `?name_like=${term}` : ''}`)
      .then(({ status, data }: IAxiosBookListRes) => {
        if (status === 200 && data) setRBooks(data);
        setLoading(false);
      });
  }, [term]);
  const onSearch = async (term: string): Promise<void> => {
    const { status, data }: IAxiosBookListRes = await axios.get(
      `http://localhost:4000/books${term ? `?name_like=${term}` : ''}`
    );
    if (status === 200 && data) setRBooks(data);
  };
  const onClickBook = (book: IBook) => {
    router.push(`/detail/${book.id}`);
  };
  return (
    <div className="w-full">
      <SearchMain
        searchOnChange={true}
        onSearch={onSearch}
        defaultValue={term}
      />
      {loading ? (
        <Loader height="60.5vh" width="100vw" />
      ) : (
        <>
          {rBooks.length ? (
            <ShowBooks books={rBooks} onClick={onClickBook} />
          ) : (
            <div className="h-[60.5vh] w-full flex justify-center items-center font-medium text-3xl text-gray-800">
              No Results
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function getServerSideProps({ query }: any) {
  return {
    props: {
      term: query['term'] || '',
    },
  };
}
