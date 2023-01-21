export default function Loader() {
  return (
    <div className="flex justify-center items-center flex-grow w-full relative">
      <div className="relative w-28 h-28">
        <div className="w-full h-full animate-spin rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 opacity-70">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full border-2 border-white" />
        </div>
        <div className="absolute top-[43px] left-[19px] font-semibold text-xl text-black opacity-100 z-30">
          Loading
        </div>
      </div>
    </div>
  );
}
