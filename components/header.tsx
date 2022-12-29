import Link from 'next/link';
import Nav from './nav';

export default function Header() {
  return (
    <header className="w-full bg-white border-gray-200 px-2 sm:px-4 py-2.5 flex items-center justify-start">
      <Link
        href="/"
        className="md:w-40 md:min-w-[10rem] w-full h-auto flex justify-end items-center"
      >
        <span className="font-extrabold text-transparent text-[2rem] bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Book 12
        </span>
      </Link>
      <Nav />
    </header>
  );
}
