import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loader from '../components/loader';
import WrongPath from '../components/wrong-path';
import { alreaySignIn } from '../props/wrong-path';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { status } = useSession();

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (!result || result.error) {
          throw new Error(result?.error);
        }
      } catch (e: any) {
        const err = String(e);
        if (err.slice(0, 6) === 'Error:') alert(err.slice(7));
        else {
          console.error(err);
          alert(err || 'Cannot log in');
        }
      }
    }
  };

  if (status === 'loading') return <Loader />;
  if (status === 'authenticated') {
    router.replace('/');
    return <WrongPath props={alreaySignIn} />;
  }
  return (
    <div className="w-full flex-grow flex justify-center items-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="w-[28rem] h-[29rem] px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl flex flex-col justify-start items-start"
      >
        <h1 className="mt-12 mb-4 text-3xl font-semibold text-center w-full">
          Log In
        </h1>
        <label htmlFor="email" className="mt-5 w-full pl-1 pb-1 font-medium">
          Email
        </label>
        <input
          required
          id="email"
          className="w-full h-12 mb-2 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="mt-5 w-full pl-1 pb-1 font-medium">
          Password
        </label>
        <input
          required
          id="password"
          className="w-full h-12 mb-2 rounded-md px-4 border shadow border-gray-400 focus:outline-none"
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          required
          className="w-full h-12 mt-8 rounded-lg border-2 border-blue-500 bg-blue-500 text-white text-xl font-semibold"
          type="submit"
          value="Log in"
        />
        <span className="w-full text-center mt-3 text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 font-medium">
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
}
