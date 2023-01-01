import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const movePage = (path: string) => {
    router.push(path);
  };
  return (
    <Navbar fluid={true} rounded={true} className="mx-2">
      <Navbar.Brand onClick={() => movePage('/')}>
        <Image
          src="/logo.svg"
          className="mr-3 h-6 sm:h-9 fill-blue-400"
          alt="logo"
          width={32}
          height={32}
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Book12
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded={true}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm pb-1">Bonnie Green</span>
            <span className="block truncate text-sm font-semibold">
              name@flowbite.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => movePage('dashboard')}>
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle className="ml-2" />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/navbars" active={true}>
          Home
        </Navbar.Link>
        <Navbar.Link href="/navbars">About</Navbar.Link>
        <Navbar.Link href="/navbars">Services</Navbar.Link>
        <Navbar.Link href="/navbars">Pricing</Navbar.Link>
        <Navbar.Link href="/navbars">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
// export default function Header() {
//   return (
//     <header className="w-full bg-white border-gray-200 px-2 sm:px-4 py-2.5 flex items-center justify-start">
//       <Link
//         href="/"
//         className="md:w-40 md:min-w-[10rem] w-full h-auto flex justify-end items-center"
//       >
//         <span className="font-extrabold text-transparent text-[2rem] bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
//           Book 12
//         </span>
//       </Link>
//       <Nav />
//     </header>
//   );
// }
