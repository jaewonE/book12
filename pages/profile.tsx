import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loader from '../components/loader';
import WrongPath, { IWrongPath } from '../components/wrong-path';

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

export default function Profile() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [coverImg, setCoverImg] = useState<string>('');
  const { status } = useSession();
  const router = useRouter();

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(email, password, name, coverImg);
  };

  if (status === 'loading') return <Loader />;
  if (status === 'authenticated') return <WrongPath props={wrongPathProp} />;
  return (
    <div className="w-full flex-grow flex justify-center items-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="w-[28rem] h-[35rem] px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl flex flex-col justify-start items-start"
      >
        <h1 className="mt-12 mb-2 text-3xl font-semibold text-center w-full">
          Sign up
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
        <label htmlFor="password" className="mt-5 w-full pl-1 pb-1 font-medium">
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
        <input
          className="w-full h-12 mt-9 rounded-lg border-2 border-blue-500 bg-blue-500 text-white text-xl font-semibold"
          type="submit"
          value="Sign up"
        />
      </form>
    </div>
  );
}
