import axios, { AxiosError } from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loader from '../components/loader';
import WrongPath from '../components/wrong-path';
import { IUser } from '../interfaces/user';
import prisma from '../lib/prisma';
import { requireLogIn } from '../props/wrong-path';

interface IProfilePageProps {
  user?: IUser;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<IProfilePageProps> = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const session = await getSession(ctx);
    if (!session?.user?.email) throw new Error('user not found');
    const email = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error(`User with email ${email} not found`);
    return { props: { user: JSON.parse(JSON.stringify(user)) } };
  } catch (e) {
    const error = String(e);
    return {
      props: { error },
    };
  }
};

export default function Profile({ user, error }: IProfilePageProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>(user?.email || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>(user?.name || '');
  const [coverImg, setCoverImg] = useState<string>('');
  const [openPassword, setOpenPassword] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  const deleteUser = async () => {
    try {
      const { data, status } = await axios.get(
        'http://localhost:3000/api/auth/delete-account'
      );
      if (status === 200 && data?.status) {
        await signOut();
        alert(`Goodbye ${user?.name || ''}`);
        router.replace('/');
        return;
      }
      throw new Error('');
    } catch (err) {
      if (err instanceof AxiosError) {
        const { error } = err.response?.data;
        if (error) {
          alert(error);
          return;
        }
      }
      alert('Cannot update profile');
      console.error(err);
    }
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert('Confirmation password does not match password');
      return;
    }
    try {
      const { data, status } = await axios.post(
        'http://localhost:3000/api/auth/update-profile',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (status === 201 && data?.status) {
        alert('Successfully update profile! Please log in again to confirm.');
        await signOut();
        router.replace('/');
        return;
      }
      throw new Error('');
    } catch (err) {
      if (err instanceof AxiosError) {
        const { error } = err.response?.data;
        if (error) {
          alert(error);
          return;
        }
      }
      alert('Cannot update profile');
      console.error(err);
    }
  };

  if (!user || error) {
    signOut();
    alert(error);
    console.error(error);
    router.replace('/');
    return <WrongPath props={requireLogIn} />;
  }
  return (
    <div className="w-full flex-grow flex justify-center items-center bg-gray-100">
      <div
        onSubmit={onSubmit}
        style={{ height: `${openPassword || isDeleteMode ? 38 : 31.5}rem` }}
        className="relative w-[28rem] px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl rounded-tl-none"
      >
        <div className="absolute -top-11 left-0 w-[28rem] h-11 flex justify-start items-end">
          <button
            onClick={() => setIsDeleteMode(false)}
            className={`bg-blue-500 border-blue-${
              isDeleteMode ? '500 opacity-50' : '600 opacity-100'
            } text-white h-full w-auto px-5 mr-2 rounded-t-md text-xl font-medium border-2 border-b-0`}
          >
            Profile
          </button>
          <button
            onClick={() => setIsDeleteMode(true)}
            className={`bg-red-500 border-red-${
              isDeleteMode ? '600 opacity-100' : '500 opacity-50'
            } text-white h-full w-auto px-5 mr-2 rounded-t-md text-xl font-medium border-2 border-b-0`}
          >
            Delete account
          </button>
        </div>
        {isDeleteMode ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="mb-2 text-2xl font-semibold text-center w-full">
              Are you sure you want to delete Your account?
            </h1>
            <div className="hover:scale-105 transition-all ease-in-out w-[15rem] h-[17rem] rounded-xl shadow-2xl border-4 border-gray-800 bg-gray-50 my-8 flex flex-col justify-start items-center">
              <Image
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                className="rounded-full mt-12"
                alt="profile"
                priority={true}
                width={110}
                height={110}
              />
              <div className="mt-5 font-semibold text-xl">{user?.name}</div>
              <div className="mt-2 text-gray-400">{user?.email}</div>
            </div>
            <div className="text-center mt-2 text-base font-medium text-gray-500">
              This will delete your product from catalog
              <div className="text-black mt-[2px]">Are you sure?</div>
            </div>
            <div className="w-full flex justify-end mt-5">
              <button
                onClick={() => setIsDeleteMode(false)}
                className="hover:bg-gray-100 transition ease-in py-1 px-3 font-medium text-lg rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="bg-red-600 text-white py-1 px-3 font-medium text-lg rounded-md ml-3"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form className="w-full h-full flex flex-col justify-start items-start">
            <h1 className="mt-12 mb-2 text-3xl font-semibold text-center w-full">
              Profile
            </h1>
            <label
              htmlFor="email"
              className="mt-5 w-full pl-1 pb-1 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full h-12 mb-1 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="name" className="mt-5 w-full pl-1 pb-1 font-medium">
              Name
            </label>
            <input
              id="name"
              className="w-full h-12 mb-1 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
              type="text"
              value={name}
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
            />
            {openPassword ? (
              <div className="w-full mt-5 flex flex-col justify-start items-start">
                <label
                  htmlFor="password"
                  className="w-full pl-1 pb-1 font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="w-full h-12 mb-1 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
                  type="password"
                  value={password}
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="confirmPassword"
                  className="w-full pl-1 pb-1 mt-5 font-medium"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  className="w-full h-12 mb-1 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            ) : (
              <div className="w-full flex flex-col justify-start items-start">
                <span className="mt-5 w-full pl-1 pb-1 font-medium">
                  Change password
                </span>
                <input
                  className="w-full h-12 mb-1 rounded-md px-4 border-2 border-gray-300 hover:border-green-400 bg-gray-300 font-medium shadow-lg hover:bg-green-500 hover:text-white focus:outline-none"
                  type="button"
                  value="Click to change password"
                  onClick={() => setOpenPassword(true)}
                />
              </div>
            )}
            <input
              className="w-full h-12 mt-8 rounded-lg border-2 border-blue-500 bg-blue-500 text-white text-xl font-semibold"
              type="submit"
              value="Update Profile"
            />
          </form>
        )}
      </div>
    </div>
  );
}
