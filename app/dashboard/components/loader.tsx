import React from "react";
import Image from "next/image";
import logo from "~/public/images/logo.svg";
import Link from "next/link";
import { IoIosInformationCircleOutline } from "react-icons/io";
interface LoaderProps {
  fetching?: boolean;
  errorFetching?: boolean;
  error?: string;
  children?: React.ReactNode;
  classname_overide?: string;
}

const Loader: React.FC<LoaderProps> = ({
  fetching,
  errorFetching,
  error,
  children,
  classname_overide,
}) => {
  const renderErrorState = () => (
    <div className="bg-navy  h-screen w-full flex items-center justify-center  flex-col">
      <div className="flex  flex-col gap-3 bg-grey    rounded-2xl  w-[500px] py-2">
        <div className="flex gap-2  items-start    p-4  w-full">
          <IoIosInformationCircleOutline size={38} className="text-red" />
          <div className="flex flex-col gap-1">
            <p className=" text-xl text-white      spaced leading-none ">
              Oops! We ran into an error.
            </p>
            <p className="text-sm  normal-case  tracking-normal text-silver-blue line-clamp-3">
              {error}
            </p>
          </div>
        </div>
        <div className="w-full  items-center justify-end  px-4 flex gap-2">
          <button
            className="h-[30px]  px-3 text-xs bg-powder-blue rounded-sm   hover:ring  duration-150  "
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
          <Link href="/">
            <button className="h-[30px]  px-3 text-xs bg-grey-blue  rounded-sm   hover:ring  duration-150 text-center  ">
              Back Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div
      className={`${classname_overide} bg-navy  h-screen w-full flex items-center justify-center  `}
    >
      <div className=" flex items-center justify-center  w-12  h-12   relative  ">
        <div className="bg-grey p-5 absolute  animate-ping w-full h-full   "></div>
        <Image src={logo} alt="Loading" className="w-20  relative z-10  " />
      </div>
    </div>
  );
  let content;

  if (errorFetching) {
    content = renderErrorState();
  } else if (fetching) {
    content = renderLoadingState();
  } else {
    content = children;
  }

  return content;
};

export default Loader;
