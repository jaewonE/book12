import axios, { AxiosError } from 'axios';
import { Dropdown } from 'flowbite-react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Loader from '../../components/loader';
import BookSvg from '../../components/svg/book';
import { IBookWithRelation } from '../../interfaces/book';
import { ICategory } from '../../interfaces/category';
import prisma from '../../lib/prisma';
import useFile, { IUseFile } from '../../lib/use-file';
import { IAxiosNewBook } from '../api/book/new';

interface IUpdateBook {
  categorys: ICategory[];
  book: IBookWithRelation;
}

export const getServerSideProps: GetServerSideProps<IUpdateBook> = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const session = await getSession(ctx);
    if (!session?.user?.email) throw new Error('user not found');
    const email = session.user.email;

    if (!ctx.params?.id) throw new Error('params not found');
    const id = Array.isArray(ctx.params.id)
      ? Number(ctx.params.id[0])
      : Number(ctx.params.id);
    const book = await prisma.book.findUnique({
      where: { id },
      include: { category: true, author: true },
    });
    if (!book) throw new Error('Book not found');
    if (book.author.email != email)
      throw new Error('Access denied: not an onwer of the book');

    const categorys = await prisma.category.findMany();
    if (!categorys) throw new Error('categorys not found');

    return { props: JSON.parse(JSON.stringify({ categorys, book })) };
  } catch (e: any) {
    console.error(e);
    return { notFound: true };
  }
};

export default function AddBook({ categorys, book }: IUpdateBook) {
  const router = useRouter();
  const initRef = useRef<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const desRef = useRef<HTMLInputElement>(null);
  const { setFile, fileDataURL }: IUseFile = useFile();
  const [categoryList] = useState<ICategory[]>(categorys);
  const [uploading, setUploading] = useState(false);
  const [showDefaultImage, setShowDefaultImage] = useState<boolean>(
    book.coverImg ? true : false
  );
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  useEffect(() => {
    if (
      !initRef.current &&
      titleRef.current !== null &&
      desRef.current !== null
    ) {
      titleRef.current.value = book.title;
      desRef.current.value = book.description || '';
      setSelectedCategory(book.category);
    }
  }, [book]);

  useEffect(() => {
    if (fileDataURL) {
      setShowDefaultImage(false);
    }
  }, [fileDataURL]);

  const addImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (!files) return;
    setFile(files[0]);
    const formData = new FormData();
    formData.append('file', files[0]);
  };

  const deleteBook = async () => {
    if (confirm(`Are you sure to delete ${book.title}?`)) {
      try {
        setUploading(true);
        const { data, status }: IAxiosNewBook = await axios.get(
          `https://book12-lyart.vercel.app/api/book/delete/${book.id}`
        );
        if (status === 200 && data?.status) {
          setUploading(false);
          alert('Successfully deleted book');
          router.replace('/dashboard');
          return;
        }
        throw new Error(data.error);
      } catch (err) {
        if (err instanceof AxiosError) {
          const { error } = err.response?.data;
          if (error) {
            alert(error);
            return;
          }
        }
        alert('Cannot delete book');
        console.error(err);
        setUploading(false);
      }
    }
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    if (!title) {
      alert('Title is required');
      return;
    }
    const description = desRef.current?.value || null;
    if (!selectedCategory) {
      alert('category is required');
      return;
    }
    try {
      setUploading(true);
      const { data, status }: IAxiosNewBook = await axios.post(
        'https://book12-lyart.vercel.app/api/book/update',
        {
          title,
          description,
          coverImg: book.coverImg,
          fileDataURL,
          categoryId: selectedCategory?.id || null,
          authorId: book.authorId,
          bookId: book.id,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (status === 201 && data?.status) {
        setUploading(false);
        alert('Successfully edit book');
        router.replace('/dashboard');
        return;
      }
      throw new Error(data.error);
    } catch (err) {
      if (err instanceof AxiosError) {
        const { error } = err.response?.data;
        if (error) {
          alert(error);
          return;
        }
      }
      alert('Cannot edit book');
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full py-10 flex-grow flex justify-center items-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="w-[28rem] md:w-[95%] max-w-4xl h-[60rem] md:h-auto md:p-7 px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl flex flex-col justify-start items-center md:items-start"
      >
        <h1 className="mt-6 md:mt-0 mb-2 md:mb-8 text-3xl font-semibold text-center w-full">
          Edit Book Infomation
        </h1>
        <div className="w-full h-full flex flex-col md:flex-row justify-start items-center md:items-start">
          <div className="min-h-[30rem] md:min-h-full md:h-full w-full md:w-1/2 flex flex-col justify-center items-center pr-4">
            <div
              className={`w-[300px] h-[25rem] border-gray-300 mb-4 rounded-2xl group ${
                fileDataURL || showDefaultImage
                  ? 'border-solid border-4'
                  : 'border-dashed border-[6px] hover:border-gray-400 transition-colors ease-in-out'
              }`}
            >
              <label
                htmlFor="file-upload"
                className="w-full h-full flex justify-center items-center"
              >
                {fileDataURL || book.coverImg ? (
                  <Image
                    priority={true}
                    style={{ width: 'auto', height: 'auto' }}
                    className="w-auto rounded-xl max-w-[296px] max-h-[396px]"
                    src={fileDataURL || book.coverImg || ''}
                    alt="preview"
                    width={296}
                    height={396}
                  />
                ) : (
                  <BookSvg className="w-[150px] h-[180px] opacity-50 group-hover:opacity-70 relative rounded-3xl shadow-xl mt-2 mb-6" />
                )}
              </label>
            </div>
            <label
              htmlFor="file-upload"
              className={`w-[90%] max-w-[310px] h-8 border border-solid text-white font-medium rounded-lg text-center text-lg ${
                fileDataURL
                  ? 'bg-green-500 border-green-400'
                  : 'bg-gray-500 border-gray-400'
              }`}
            >
              Edit Book
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden pointer-events-none"
              accept="image/jpg,impge/png,image/jpeg,image/gif"
              name="bookImg"
              onChange={(e) => addImg(e)}
            />
          </div>
          <div className="h-auto md:h-full w-full md:w-1/2 flex flex-col justify-start md:justify-end items-start pl-4">
            <label
              htmlFor="title"
              className="mt-5 w-full pl-1 pb-1 font-medium"
            >
              Title
            </label>
            <input
              ref={titleRef}
              required
              id="title"
              className="w-full h-12 mb-2 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
              type="text"
              placeholder="title"
            />
            <label
              htmlFor="description"
              className="mt-5 w-full pl-1 pb-1 font-medium"
            >
              Description
            </label>
            <input
              required
              ref={desRef}
              id="description"
              className="w-full h-12 mb-2 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
              type="text"
              placeholder="description"
            />
            <span className="mt-5 w-full pl-1 pb-1 font-medium">Category</span>
            <div className="p-1 w-full h-auto flex flex-row-reverse justify-start items-center rounded-md border border-solid shadow border-gray-400">
              <Dropdown
                id="category-dropdown"
                className="min-w-[130px]"
                label="Category"
                dismissOnClick={true}
              >
                {categoryList.map((item, index) => (
                  <Dropdown.Item
                    onClick={() => setSelectedCategory(item)}
                    key={index}
                  >
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
              <label
                htmlFor="category-dropdown"
                className="flex-grow text-center overflow-x-hidden mr-3 font-medium text-gray-600"
              >
                {selectedCategory?.name || 'Select Category'}
              </label>
            </div>
            <div className="w-full h-auto rounded-md bg-blue-500 focus:bg-blue-600"></div>
            <div className="w-full flex justify-around items-start pt-8 gap-4">
              <input
                required
                className="md:w-48 w-[9.5rem] h-10 rounded-lg border-2 border-blue-500 bg-blue-500 text-white text-xl font-semibold"
                type="submit"
                value="Submit"
              />
              <input
                required
                className="md:w-48 w-[9.5rem] h-10 rounded-lg border-2 border-red-500 bg-red-500 text-white text-xl font-semibold"
                type="button"
                value="DELETE"
                onClick={deleteBook}
              />
            </div>
          </div>
        </div>
      </form>
      {uploading && (
        <div className="absolute top-0 left-0 w-full h-full z-20 bg-black bg-opacity-30 flex flex-col justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
}
