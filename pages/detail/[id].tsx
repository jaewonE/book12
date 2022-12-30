import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { IAxiosBookRes, IBook } from '../../interfaces/book';

export const getServerSideProps: GetServerSideProps<{ book: IBook }> = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    if (ctx.params?.id) {
      const { status, data }: IAxiosBookRes = await axios(
        `http://localhost:4000/books/${ctx.params.id}`
      );
      if (status === 200 && data)
        return {
          props: {
            book: data,
          },
        };
    }
  } catch (e: any) {}
  return { notFound: true };
};

export default function DetailPage({ book }: { book: IBook }) {
  return (
    <div className="mt-10 w-full flex flex-col md:flex-row justify-start items-center">
      <div className="w-1/2 relative flex justify-center items-center">
        <Image
          className="relative rounded-xl shadow-xl md:max-w-[17rem] lg:max-w-none min-w-[200px]"
          src={book.coverImg}
          alt={book.name}
          width={330}
          height={550}
        />
      </div>
      <div className="mt-10 md:mb-16 px-12 md:pl-0 md:pr-5 w-full md:w-1/2 flex flex-col justify-start items-start border-2 border-t-2 border-gray-900">
        <span className="font-semibold text-3xl">{book.name}</span>
        <span className="font-medium text-xl mt-1 text-gray-600">
          {book.category} | {book.owner}
        </span>
      </div>
    </div>
  );
}
