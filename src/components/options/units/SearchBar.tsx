import { Suspense, useDeferredValue, useState, lazy } from "react";
import { IoSearchSharp } from "@react-icons/all-files/io5/IoSearchSharp";
import { useQuery } from "react-query";
import { findHouses } from "../../../api/houseApi";
const SearchResult = lazy(() => import("./SearchResult"));

export default function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");
  const deferredInputValue = useDeferredValue<string>(inputValue);
  const isStale = inputValue !== deferredInputValue;
  const { data } = useQuery(
    //, isLoading, error
    ["value", deferredInputValue],
    async () => await findHouses(deferredInputValue)
  );

  return (
    <div>
      <div className="flex mr-6 border-solid border border-[#9ca3af] rounded text-sm">
        <input
          type="text"
          className="px-2 py-2 bg-white rounded-l focus:outline-none w-80"
          placeholder="주택명, 주소 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="px-2 py-2 bg-white rounded-r">
          <IoSearchSharp />
        </button>
      </div>
      {data && (
        <Suspense fallback={<div>loading...</div>}>
          <div className="absolute mt-1 bg-white w-80 border border-[#9ca3af] rounded text-sm overflow-y-auto max-h-52">
            <div style={{ opacity: isStale ? 0.5 : 1 }}>
              <SearchResult propsData={data} />
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
}

//
