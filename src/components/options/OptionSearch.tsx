import { useOptionStore } from "../../store/optionStore";

export default function OptionSearch() {
  const { rank, setRank } = useOptionStore();

  const onClickRankBtn = (value: number) => {
    setRank(value);
  };

  return (
    <div className="z-10 absolute top-0 right-0 m-10 bg-[#f5f5f5] px-1 py-1 text-black rounded-[3px] border-solid border border-[#9ca3af]">
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
