import SearchBar from "./units/SearchBar";
import RankFilter from "./units/RankFilter";

export default function OptionSearch() {
  return (
    <>
      <div className="absolute z-10 flex items-center justify-center m-10 text-black md:top-0 md:right-0 top-10 right-[0%] translate-y-[-50%] md:translate-x-[0%] md:translate-y-[0%] ">
        <SearchBar />
        <RankFilter />
      </div>
    </>
  );
}
