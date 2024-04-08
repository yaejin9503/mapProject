import { useOptionStore } from "../../../store/optionStore";

export default function RankFilter() {
  const { rank, setRank } = useOptionStore();

  const onClickRankBtn = (value: number) => {
    setRank(value);
  };

  return (
    <div className="bg-[#f5f5f5] text-black rounded-[3px] px-1 py-1 border-solid border border-[#9ca3af] hidden md:block ">
      <button
        onClick={() => onClickRankBtn(1)}
        className={
          rank === 1
            ? "text-sm py-1 px-2 rounded-[3px] bg-white shadow"
            : "text-sm py-1 px-2 rounded-[3px]"
        }
      >
        1순위
      </button>
      <button
        onClick={() => onClickRankBtn(2)}
        className={
          rank === 2
            ? "text-sm py-1 px-2 rounded-[3px] bg-white shadow"
            : "text-sm py-1 px-2 rounded-[3px]"
        }
      >
        2-3순위
      </button>
    </div>
  );
}
