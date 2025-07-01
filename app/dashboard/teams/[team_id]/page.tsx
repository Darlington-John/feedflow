"use client";
import { useSearchParams } from "next/navigation";
import Invite from "./invite";
import Feedbacks from "./feedbacks";
import Members from "./members";

const Team = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <>
      {!query || (query === "feedbacks" && <Feedbacks />)}
      {query === "members" && <Members />}
      {query === "invite" && <Invite />}
    </>
  );
};

export default Team;
