import Image from 'next/image';
import { useState } from 'react';

interface IMainSearch {
  onSearch: (term: string) => void;
  defaultValue?: string;
  searchOnChange?: boolean;
}

export default function MainSearch({
  onSearch,
  defaultValue,
  searchOnChange = false,
}: IMainSearch) {
  const [term, setTerm] = useState<string>(defaultValue || '');
  const onSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    onSearch(term);
  };
  const onChange = (value: string) => {
    setTerm(value);
    if (searchOnChange) onSearch(value);
  };
  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="w-full h-80 relative mb-5 flex justify-center items-center"
    >
      <Image
        width={1000}
        height={200}
        priority={true}
        src="/main-search-bg.jpg"
        alt="Picture of the books"
        className="absolute top-0 left-0 w-full h-80 min-h-[20rem] object-cover -z-10 pointer-events-none"
        sizes="100vw"
      />
      <div className="w-3/5 h-14 relative">
        <input
          className="w-full h-full rounded-xl border-2 border-gray-500 bg-gray-100 focus:outline-none outline-none font-medium pl-6 pr-16 text-xl pb-1"
          type="text"
          value={term}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search the books!"
        />
        <Image
          onClick={onSubmit}
          className=" absolute top-[14px] right-6 opacity-80"
          src="/magnifying-glass-solid.svg"
          alt="search"
          width={26}
          height={26}
        />
      </div>
    </form>
  );
}
