type booleanButton = {
  header: string;
  state: string | number | boolean;
  setState: React.Dispatch<React.SetStateAction<string | number | boolean>>;
  firstChoice: string | number | boolean;
  secondChoice: string | number | boolean;
  thirdChoice?: string | number | boolean;

  setFirstCleanup?: React.Dispatch<
    // eslint-disable-next-line
    React.SetStateAction<string | number | boolean | any>
  >;
  // eslint-disable-next-line
  setFirstCleanupValue?: any;
  // eslint-disable-next-line
  setSecondCleanupValue?: any;
  setSecondCleanup?: React.Dispatch<
    // eslint-disable-next-line
    React.SetStateAction<string | number | boolean | any>
  >;
  setThirdCleanup?: React.Dispatch<
    React.SetStateAction<string | number | boolean>
  >;
  // eslint-disable-next-line
  setThirdCleanupValue?: any;
  setError?: React.Dispatch<React.SetStateAction<string>>;
};
const BooleanButton = ({
  header,
  state,
  setState,
  firstChoice,
  secondChoice,
  thirdChoice,
  setFirstCleanup,
  setSecondCleanup,
  setError,
  setFirstCleanupValue,
  setSecondCleanupValue,
  setThirdCleanup,
  setThirdCleanupValue,
}: booleanButton) => {
  return (
    <div className="flex gap-1 flex-col ">
      <span className="text-[11px]        text-light-blue   uppercase">
        {header}: {state.toString()}
      </span>
      <div className="flex w-full gap-2">
        <button
          className={`  gap-2  h-[35px]  px-2    duration-150    w-[50%]  uppercase  text-[11px]  text-center capitalize ${
            state === firstChoice
              ? "bg-powder-blue  text-white "
              : "   text-white    ring-grey    hover:ring-[1px] ring     "
          }`}
          onClick={() => {
            setState(firstChoice);
            setFirstCleanup?.(setSecondCleanupValue);
            setError?.("");
          }}
        >
          {firstChoice.toString()}
        </button>
        <button
          className={`  gap-2  h-[35px]  px-2    duration-150    w-[50%]  uppercase  text-[11px]    text-center capitalize ${
            state === secondChoice
              ? "bg-powder-blue  text-white "
              : "   text-white    ring-grey    hover:ring-[1px] ring     "
          }`}
          onClick={() => {
            setState(secondChoice);
            setSecondCleanup?.(setFirstCleanupValue);
            setError?.("");
          }}
        >
          {secondChoice.toString()}
        </button>
        {thirdChoice && (
          <button
            className={`  gap-2  h-[35px]  px-2    duration-150    w-[50%]  uppercase  text-[11px]  text-center capitalize ${
              state === thirdChoice
                ? "bg-softGreen  text-white "
                : " bg-white  text-grey   ring-grey  border border-grey hover:ring-[1px] hover:ring     ring-offset-[1px]"
            }`}
            onClick={() => {
              setState?.(thirdChoice);
              setThirdCleanup?.(setThirdCleanupValue);
              setError?.("");
            }}
          >
            {thirdChoice.toString()}
          </button>
        )}
      </div>
    </div>
  );
};

export default BooleanButton;
