import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="w-full flex justify-end items-center pr-2">
      <ul className="flex flex-col py-6 px-6 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-md md:font-medium md:border-0 md:bg-white">
        <li>
          <Link
            href="#"
            className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
            aria-current="page"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
