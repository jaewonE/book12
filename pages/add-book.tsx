import axios, { AxiosError } from 'axios';
import { Dropdown } from 'flowbite-react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Loader from '../components/loader';
import BookSvg from '../components/svg/book';
import { ICategory } from '../interfaces/category';
import prisma from '../lib/prisma';
import useFile, { IUseFile } from '../lib/use-file';
import { IAxiosNewBook } from './api/book/new';

interface IAddBook {
  categorys: ICategory[];
}

export const getServerSideProps: GetServerSideProps<IAddBook> = async () => {
  try {
    const categorys = await prisma.category.findMany();
    if (!categorys) throw new Error('categorys not found');
    return { props: { categorys } };
  } catch (e: any) {
    console.error(e);
    return { props: { categorys: [] } };
  }
};

export default function AddBook({ categorys }: IAddBook) {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const desRef = useRef<HTMLInputElement>(null);
  const { setFile, fileDataURL }: IUseFile = useFile();
  const [categoryList] = useState<ICategory[]>(categorys);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const addImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (!files) return;
    setFile(files[0]);
    const formData = new FormData();
    formData.append('file', files[0]);
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    if (!title) {
      alert('Title is required');
      return;
    }
    const description = desRef.current?.value;
    if (!description) {
      alert('description is required');
      return;
    }
    if (!selectedCategory) {
      alert('category is required');
      return;
    }
    try {
      setUploading(true);
      const { data, status }: IAxiosNewBook = await axios.post(
        'https://book12-lyart.vercel.app/api/book/new',
        { title, description, category: selectedCategory, fileDataURL },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setUploading(false);
      if (status === 201 && data?.status) {
        alert('Successfully add book');
        router.replace('/dashboard');
        return;
      }
      throw new Error(data.error);
    } catch (err: any) {
      setUploading(false);
      if (err instanceof AxiosError) {
        const { error } = err.response?.data;
        if (error) {
          alert(error);
          return;
        }
      }
      alert('Cannot add book');
      console.error(err);
    }
  };

  return (
    <div className="w-full py-10 flex-grow flex justify-center items-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="w-[28rem] md:w-[95%] max-w-4xl h-[60rem] md:h-auto md:p-7 px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl flex flex-col justify-start items-center md:items-start"
      >
        <h1 className="mt-6 md:mt-0 mb-2 md:mb-8 text-3xl font-semibold text-center w-full">
          Add new book
        </h1>
        <div className="w-full h-full flex flex-col md:flex-row justify-start items-center md:items-start">
          <div className="min-h-[30rem] md:min-h-full md:h-full w-full md:w-1/2 flex flex-col justify-center items-center pr-4">
            <div
              className={`w-[300px] h-[25rem] border-gray-300 mb-4 rounded-2xl ${
                fileDataURL
                  ? 'border-solid border-4'
                  : 'border-dashed border-[6px] hover:border-gray-400 transition-colors ease-in-out'
              }`}
            >
              <label
                htmlFor="file-upload"
                className="w-full h-full flex justify-center items-center"
              >
                {fileDataURL ? (
                  <Image
                    priority={true}
                    style={{ width: 'auto', height: 'auto' }}
                    className={`w-auto rounded-xl ${
                      fileDataURL
                        ? 'max-w-[296px] max-h-[396px]'
                        : 'max-w-[150px] max-h-[180px] opacity-40'
                    }`}
                    src={fileDataURL}
                    alt="preview"
                    width={fileDataURL ? 296 : 150}
                    height={fileDataURL ? 396 : 180}
                  />
                ) : (
                  <BookSvg className="w-[170px] h-[200px] opacity-50 relative rounded-3xl shadow-xl mt-2 mb-6" />
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
              Add Book
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
            <input
              className="w-full h-12 mt-8 rounded-lg border-2 border-blue-500 bg-blue-500 text-white text-xl font-semibold"
              type="submit"
              value="Submit"
            />
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
