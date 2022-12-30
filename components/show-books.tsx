import Image from 'next/image';
import { IBook } from '../interfaces/book';

interface IShoowBooks {
  books: IBook[];
  onClick?: (book: IBook, index: number) => void | Promise<void>;
}

export default function ShowBooks({ books, onClick }: IShoowBooks) {
  const onClickBook = onClick ? onClick : () => {};
  if (!books) return <div>Loading...</div>;
  return (
    <div className="w-full h-auto flex flex-wrap justify-center items-start">
      {books.map((book, index) => (
        <div
          className="bg-gray-100 rounded-2xl w-full h-80 sm:w-60 xl:w-80 xl:h-[26rem] sm:m-5 mb-7 flex justify-start sm:flex-col"
          onClick={() => onClickBook(book, index)}
          key={index}
        >
          <div className="relative w-44 min-w-[11rem] xl:min-w-[18rem] h-full flex justify-center items-center sm:items-end ml-7">
            <Image
              className="relative rounded-lg shadow-xl"
              src={book.coverImg}
              alt={book.name}
              width={210}
              height={280}
            />
          </div>
          <div className="w-full h-full sm:h-24 pl-10 sm:pl-0 flex flex-col justify-center items-start sm:items-center">
            <span className="font-bold text-2xl sm:text-lg xl:text-xl pb-1 sm:pb-0 sm:pt-1">
              {book.name}
            </span>
            <span className="text-base font-medium xl:font-bold text-gray-700 xl:text-gray-500">
              {book.owner} | {book.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
