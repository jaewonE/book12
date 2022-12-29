import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-5 p-4 bg-gray-600 shadow md:flex md:items-center md:justify-between md:p-6">
      <span className="text-sm text-gray-300 sm:text-center">
        © 2022 JaewonE . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-300 sm:mt-0">
        <li>
          <Link href="#" className="mr-4 hover:underline md:mr-6 ">
            About
          </Link>
        </li>
        <li>
          <Link href="#" className="mr-4 hover:underline md:mr-6">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link href="#" className="mr-4 hover:underline md:mr-6">
            Licensing
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </footer>
  );
}
