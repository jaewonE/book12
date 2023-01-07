import Image from 'next/image';
import { IBookWithRelationName } from '../interfaces/book';
import BookSvg from './svg/book';

interface IShoowBooks {
  books: IBookWithRelationName[];
  forceListMode?: boolean;
  onClick?: (
    book: IBookWithRelationName,
    index: number
  ) => void | Promise<void>;
}

export default function ShowBooks({
  books,
  onClick,
  forceListMode = false,
}: IShoowBooks) {
  const onClickBook = onClick ? onClick : () => {};
  if (!books) return <div>Loading...</div>;
  return (
    <div className="w-full h-auto flex flex-wrap justify-center items-start mb-4">
      {books.map((book, index) => (
        <div
          className={`bg-gray-100 h-[17rem] w-full mb-4 px-3 sm:px-0 flex justify-start ${
            forceListMode
              ? ''
              : 'sm:rounded-2xl sm:m-5 sm:py-3 sm:h-[22.5rem] sm:flex-col sm:w-[15.5rem] xl:w-[18rem] xl:h-[23rem]'
          }`}
          onClick={() => onClickBook(book, index)}
          key={index}
        >
          <div
            className={`relative w-44 min-w-[9rem] h-full flex justify-center items-center ml-7 ${
              forceListMode
                ? ''
                : 'sm:ml-0 sm:w-full sm:items-end xl:min-w-[18rem]'
            }`}
          >
            {book.coverImg ? (
              <Image
                className="relative rounded-lg shadow-xl mt-2"
                src={book.coverImg}
                alt={book.title}
                width={180}
                height={220}
              />
            ) : (
              <BookSvg className="w-[170px] h-[200px] relative rounded-3xl shadow-xl mt-2 mb-6" />
            )}
          </div>
          <div
            className={`w-full h-full pl-10 sm:pl-0 flex flex-col justify-center items-start ${
              forceListMode ? '' : 'sm:items-center sm:h-24 sm:pl-0'
            }`}
          >
            <span
              className={`pb-1 break-words h-auto font-semibold text-xl ${
                forceListMode ? '' : 'sm:pb-0 sm:pt-1 sm:text-lg xl:text-xl'
              }`}
            >
              {book.title}
            </span>
            <span
              className={`text-gray-700 text-sm font-normal ${
                forceListMode ? '' : 'xl:font-bold  xl:text-gray-500'
              }`}
            >
              {book.author.name} | {book.category.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
