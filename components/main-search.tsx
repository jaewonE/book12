import Image from 'next/image';
import { useState } from 'react';
import SearchSvg from './svg/search';

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
      className="w-full h-64 relative mb-5 flex justify-center items-center"
    >
      <Image
        width={1000}
        height={200}
        priority={true}
        src="/main-search-bg.jpg"
        alt="Picture of the books"
        className="absolute top-0 left-0 w-full h-64 min-h-[16rem] object-cover -z-10 pointer-events-none"
        sizes="100vw"
      />
      <div className="w-3/5 h-14 relative">
        <input
          className="w-full h-full rounded-xl border-2 border-gray-500 bg-gray-100 focus:outline-none outline-none font-medium pl-6 pr-16 text-xl"
          type="text"
          value={term}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search the books!"
        />
        <SearchSvg
          fill="#000"
          className="w-[26px] h-[26px] absolute top-[14px] right-6 opacity-80"
        />
      </div>
    </form>
  );
}
