import Link from 'next/link';

interface IWrongPathMessage {
  message: string;
  linkName: string;
  linkHref?: string;
}

export interface IWrongPath {
  maintitle: string;
  subtitle?: string;
  linkName: string;
  linkHref?: string;
  message?: IWrongPathMessage;
}

export default function WrongPath({
  props: { maintitle, subtitle, linkName, linkHref = '/', message },
}: {
  props: IWrongPath;
}) {
  return (
    <div className="w-full flex-grow flex justify-center items-center bg-gray-100">
      <div className="w-[27rem] h-[27rem] px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl flex flex-col justify-evenly items-center">
        <div className="text-3xl font-semibold text-center w-full">
          {maintitle}
          {subtitle && (
            <div className="w-full text-center text-lg font-medium mt-3">
              {subtitle}
            </div>
          )}
        </div>
        <Link
          href={linkHref}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-lg font-medium"
        >
          {linkName}
        </Link>
        {message && (
          <span className="w-full text-center text-gray-600">
            {"Don't have an account? "}
            <Link href="/signup" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
