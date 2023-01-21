import Image from 'next/image';

export default function Contact() {
  return (
    <div className="w-full flex-grow bg-gray-100 flex justify-center items-center">
      <div className="w-[28rem] h-[29rem] px-14 border-4 border-gray-700 bg-white shadow-2xl rounded-xl flex flex-col justify-start items-start">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="mb-2 text-2xl font-semibold text-center w-full">
            DEVELOPER
          </h1>
          <div className="hover:scale-105 transition-all ease-in-out w-[15rem] h-[17rem] rounded-xl shadow-2xl border-4 border-gray-800 bg-gray-50 my-8 flex flex-col justify-start items-center">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/book12-83e47.appspot.com/o/dev-profile.jpg?alt=media&token=f336d79c-8889-49fe-a339-1d0c3aaa5cbc"
              className="rounded-full mt-10 max-w-[110px] max-h-[110px] w-[110px] h-[110px] object-cover"
              alt="profile"
              priority={true}
              width={110}
              height={110}
            />
            <div className="mt-5 font-semibold text-xl">JaewonE</div>
            <div className="mt-2 text-gray-400">importjaewonE@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
