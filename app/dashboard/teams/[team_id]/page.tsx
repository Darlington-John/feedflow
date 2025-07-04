"use client";
import { useParams, useSearchParams } from "next/navigation";
import Invite from "./invite";
import Feedbacks from "./feedbacks";
import Members from "./members";
import { useEffect } from "react";
import { socket } from "~/lib/utils/socket";

const Team = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { team_id } = useParams();
  useEffect(() => {
    if (socket.connected && team_id) {
      socket.emit("join-team", team_id);
    } else {
      socket.on("connect", () => {
        if (team_id) socket.emit("join-team", team_id);
      });
    }

    return () => {
      socket.off("connect");
    };
  }, [team_id]);

  return (
    <div className="relative  z-20">
      {!query || (query === "feedbacks" && <Feedbacks />)}
      {query === "members" && <Members />}
      {query === "invite" && <Invite />}
    </div>
  );
};

export default Team;
