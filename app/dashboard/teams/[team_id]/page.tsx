"use client";
import { useSearchParams } from "next/navigation";

const Team = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <>
      {!query || (query === "feedbacks" && "feedback")}
      {query === "members" && "members"}
      {query === "saved" && "saves"}
    </>
  );
};

export default Team;
