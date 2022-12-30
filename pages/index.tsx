import axios from 'axios';
import { useEffect, useState } from 'react';
import ShowBooks from '../components/show-books';
import MainSearch from '../components/main-search';
import { IBook } from '../interfaces/book';
import { useRouter } from 'next/router';

export default function Home() {
  const [rBooks, setRBooks] = useState<IBook[]>([]);
  const router = useRouter();
  useEffect(() => {
    axios.get('http://localhost:4000/books').then(({ status, data }) => {
      if (status === 200 && data) setRBooks(data);
    });
  }, []);
  const onSearch = (term: string): void => {
    if (term) router.push(`/search?term=${term}`);
  };
  const onClickBook = (book: IBook) => {
    router.push(`/detail/${book.id}`);
  };
  return (
    <div className="w-full">
      <MainSearch onSearch={onSearch} />
      <ShowBooks books={rBooks} onClick={onClickBook} />
    </div>
  );
}
