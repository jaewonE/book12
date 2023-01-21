import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="h-20 w-full absolute bottom-0 left-0 p-4 bg-gray-600 shadow md:flex md:items-center md:justify-between md:p-6">
      <span className="text-sm text-gray-300 sm:text-center">
        © 2022 JaewonE . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-2 text-sm text-gray-300">
        <li>
          <div className="mr-4 md:mr-6">Licensing | MIT</div>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </footer>
  );
}
