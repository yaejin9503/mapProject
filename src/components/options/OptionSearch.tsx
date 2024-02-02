import { useState } from "react";
import { useOptionStore } from "../../store/optionStore";

export default function OptionSearch() {
  const [firstBtnClassName, setFirstBtnClassName] = useState(
    "text-sm mr-2 py-1 px-2 rounded-[3px] bg-white shadow"
  );
  const [secondBtnClassName, setSecondBtnClassName] = useState(
    "text-sm mr-2 py-1 px-2 rounded-[3px]"
  );

  const { setRank } = useOptionStore();

  const onClickRankBtn = (value: number) => {
    setRank(value);

    const className = "text-sm mr-2 py-1 px-2 rounded-[3px]";
    let selected1 = "";
    let selected2 = "";

    if (value === 1) {
      selected1 += " bg-white shadow";
    } else {
      selected2 += " bg-white shadow";
    }
    setFirstBtnClassName(className + selected1);
    setSecondBtnClassName(className + selected2);
  };

  return (
    <div className="z-10 absolute top-0 right-0 m-10 bg-[#f5f5f5] px-1 py-1 text-black rounded-[3px] border-solid border border-[#9ca3af]">
      <button onClick={() => onClickRankBtn(1)} className={firstBtnClassName}>
        1순위
      </button>
      <button onClick={() => onClickRankBtn(2)} className={secondBtnClassName}>
        2-3순위
      </button>
    </div>
  );
}
