"use client";
import { useSearchParams } from "next/navigation";
import Feedbacks from "./user-feedbacks";

const Team = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return <>{!query || (query === "feedbacks" && <Feedbacks />)}</>;
};

export default Team;
