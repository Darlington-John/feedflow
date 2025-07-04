"use client";
import { useSearchParams } from "next/navigation";
import Feedbacks from "./user-feedbacks";
import { Suspense } from "react";

const Team = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <Suspense>{!query || (query === "feedbacks" && <Feedbacks />)}</Suspense>
  );
};

export default Team;
