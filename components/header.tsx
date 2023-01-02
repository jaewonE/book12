import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useWindowSize from '../lib/window-size';

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { width } = useWindowSize();
  return (
    <Navbar fluid={true} rounded={true} className="mx-2">
      <Navbar.Brand onClick={() => router.push('/')}>
        <Image
          src="/logo.svg"
          alt="logo"
          className="w-[30px] h-[30px]"
          width={30}
          height={30}
        />
        <span className="ml-3 cursor-pointer self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Book12
        </span>
      </Navbar.Brand>
      <div className="flex-grow md:flex-grow-0 flex md:order-2 justify-end items-center">
        <Navbar.Toggle className="mr-3" />
        {status === 'authenticated' && session.user ? (
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="profile"
                img={
                  session.user.image ||
                  'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                }
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm pb-1">
                {session.user.name || ''}
              </span>
              <span className="block truncate text-sm font-semibold">
                {session.user.email || ''}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => router.push('/profile')}>
              Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() => router.push('dashboard')}>
              Dashboard
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <div className="md:flex md:order-2 hidden md:visible">
            <button
              onClick={() => router.push('signin')}
              className="px-3 py-1 border rounded-md ml-3 bg-gray-50 font-medium"
            >
              Log In
            </button>
            <button
              onClick={() => router.push('signup')}
              className="px-3 py-1 border rounded-md ml-3 bg-yellow-300"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          className="rounded-md hover:font-semibold hover:bg-blue-500 hover:text-white"
          href="/"
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          className="rounded-md hover:font-semibold hover:bg-blue-500 hover:text-white"
          href="/search"
        >
          Search
        </Navbar.Link>
        <Navbar.Link
          className="rounded-md hover:font-semibold hover:bg-blue-500 hover:text-white"
          href="/search"
        >
          Services
        </Navbar.Link>
        <Navbar.Link
          className="rounded-md hover:font-semibold hover:bg-blue-500 hover:text-white"
          href="/navbars"
        >
          Pricing
        </Navbar.Link>
        <Navbar.Link
          className="rounded-md hover:font-semibold hover:bg-blue-500 hover:text-white"
          href="/navbars"
        >
          Contact
        </Navbar.Link>
        {status === 'unauthenticated' && width && width <= 768 && (
          <Navbar.Link
            href="/signin"
            className="bg-yellow-300 rounded-md font-semibold hover:bg-blue-500 hover:text-white"
          >
            Login
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
