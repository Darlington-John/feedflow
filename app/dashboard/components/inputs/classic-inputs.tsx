import { FaEye, FaEyeSlash } from "react-icons/fa";
type InputProps<T extends string | number> = {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  error?: string;
  label?: string;
  errorContent?: string;
  name?: string;
  inputType?: string;
  placeholder?: string;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  note?: string;
  textarea?: boolean;
  except?: boolean;
  autocomplete?: "on" | "off";
  autofocus?: boolean;
  required?: boolean;
  password?: boolean;
  passwordVisible?: boolean;
  toggleVisibility?: () => void;
  serverError?: string[];
  classname_overide?: string;
  disableSpaces?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  maxlength?: number;
};
const ClassicInput = <T extends string | number>({
  value,
  error,
  setValue,
  setError,
  errorContent,
  maxlength,
  placeholder,
  inputType = "text",
  label,
  note,
  name,
  textarea = false,
  autocomplete = "on",
  autofocus = false,
  required = false,
  password,
  toggleVisibility,
  passwordVisible,
  serverError,
  classname_overide,
  onKeyDown,
  disableSpaces = false,
  onChange,
}: InputProps<T>) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disableSpaces && e.key === " ") {
      e.preventDefault();
    }

    if (onKeyDown) onKeyDown(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disableSpaces) {
      const valueWithoutSpaces = e.target.value.replace(/\s/g, "");
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: valueWithoutSpaces },
      };
      if (onChange)
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    } else {
      if (onChange) onChange(e);
    }
  };
  return (
    <div className="flex flex-col gap-1 w-full ">
      {label && (
        <span
          className={`text-[11px]  uppercase tracking-wide   ${
            error && serverError?.includes(error) && "text-red"
          } ${
            error === errorContent && !value ? "text-red" : "text-light-blue"
          }`}
        >
          {label}
        </span>
      )}
      {!textarea && (
        <div className="flex  items-center justify-center relative w-full">
          <input
            className={`  ${classname_overide} h-[45px] py-1 px-3 bg-grey  text-white   text-sm    focus:ring-[1px]    ring-grey-blue   outline-none w-full  duration-150 max-sm:h-[40px]  ${
              error && serverError?.includes(error) && "border-red border-2"
            }     ${
              error === errorContent && !value
                ? "border-red border-2 "
                : "border-grey"
            }
${password && "pr-8"}
            `}
            placeholder={placeholder}
            type={inputType}
            value={value}
            name={name}
            autoFocus={autofocus}
            required={required}
            autoComplete={autocomplete}
            onChange={(e) => {
              setValue(e.target.value as T);
              setError?.("");
              handleChange(e);
            }}
            onKeyDown={handleKeyDown}
          />
          {password &&
            (passwordVisible ? (
              <FaEyeSlash
                className=" absolute right-2  cursor-pointer text-white"
                onClick={toggleVisibility}
              />
            ) : (
              <FaEye
                className=" absolute right-2  cursor-pointer text-white"
                onClick={toggleVisibility}
              />
            ))}
        </div>
      )}

      {textarea && (
        <div className="flex flex-col gap-1 ">
          <textarea
            className={` ${classname_overide}  min-h-[50px] py-1 px-3     bg-grey  text-white   text-sm    focus:ring-[1px]    ring-grey-blue   outline-none w-full  duration-150  ${
              error && serverError?.includes(error) && "border-red border-2"
            }     ${
              error === errorContent && !value
                ? "border-red border-2 "
                : "border-grey"
            }`}
            placeholder={placeholder}
            value={value}
            maxLength={maxlength ?? undefined}
            required
            onChange={(e) => {
              setValue(e.target.value as T);
              setError?.("");
            }}
          />
          <span className="text-xs text-silver-blue text-end">
            {String(value).length}/{maxlength}
          </span>
        </div>
      )}
      {error && serverError?.includes(error) && (
        <h1 className="text-[11px]  text-red">{error}</h1>
      )}
      {note && <h1 className="text-[11px]  text-grey">*{note}</h1>}
    </div>
  );
};

export default ClassicInput;
