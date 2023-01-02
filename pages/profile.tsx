import axios, { AxiosError } from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loader from '../components/loader';
import WrongPath, { IWrongPath } from '../components/wrong-path';
import { IUser } from '../interfaces/user';
import prisma from '../lib/prisma';

const wrongPathProp: IWrongPath = {
  maintitle: 'Please Log in',
  subtitle: 'You need to login to setup your profile',
  linkName: 'Go to main page',
  linkHref: '/',
  message: {
    message: "Don't have an account? ",
    linkName: 'Sign up',
    linkHref: '/signup',
  },
};

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
  const { status } = useSession();

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
          originEmail: user?.email || '',
          originPassword: user?.password || '',
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
      if (status === 201 && data) {
        const goToMain = user?.email !== email;
        alert(
          `Successfully update profile${
            goToMain && '\nPlease log in again to check your email'
          }`
        );
        if (goToMain) {
          await signOut();
          router.replace('/');
        }
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

  if (status === 'loading') return <Loader />;
  if (status === 'unauthenticated') return <WrongPath props={wrongPathProp} />;
  if (!user || error) {
    signOut();
    alert(error);
    console.error(error);
    router.replace('/');
  }
  return (
    <div className="w-full flex-grow flex justify-center items-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        style={{ height: `${openPassword ? 38 : 31.5}rem` }}
        className="w-[28rem] h-[38rem] px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl flex flex-col justify-start items-start"
      >
        <h1 className="mt-12 mb-2 text-3xl font-semibold text-center w-full">
          Profile
        </h1>
        <label htmlFor="email" className="mt-5 w-full pl-1 pb-1 font-medium">
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
            <label htmlFor="password" className="w-full pl-1 pb-1 font-medium">
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
    </div>
  );
}
