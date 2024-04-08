import { Suspense, useDeferredValue, useState } from "react";
import { IoSearchSharp } from "@react-icons/all-files/io5/IoSearchSharp";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import SearchResult from "./SearchResult";

export default function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");
  const deferredInputValue = useDeferredValue<string>(inputValue);
  const isStale = inputValue !== deferredInputValue;

  return (
    <div>
      <div className="flex md:mr-6 border-solid border bg-white border-[#9ca3af] rounded text-sm items-center max-h-10">
        <input
          type="text"
          className="px-2 py-2 bg-white rounded-l w-44 focus:outline-none md:w-72"
          placeholder="주택명, 주소 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex items-center justify-center w-9">
          {inputValue && (
            <button className="text-gray-500" onClick={() => setInputValue("")}>
              <AiOutlineClose />
            </button>
          )}
        </div>
        <button className="flex items-center justify-center px-2 py-2 rounded-r">
          <IoSearchSharp />
        </button>
      </div>
      {deferredInputValue && (
        <Suspense fallback={<div>loading...</div>}>
          <SearchResult query={deferredInputValue} isStale={isStale} />
        </Suspense>
      )}
    </div>
  );
}

//
