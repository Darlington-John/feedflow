import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { team_type } from "~/lib/types/team";

interface teamsState {
  teams: team_type[];
}
const initialState: teamsState = {
  teams: [],
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<team_type[]>) => {
      state.teams = action.payload;
    },
    addTeam: (state, action: PayloadAction<team_type>) => {
      const newTeam = action.payload;
      state.teams.unshift(newTeam);
    },
    editTeamName: (
      state,
      action: PayloadAction<{
        teamId: string;
        name: string;
      }>
    ) => {
      const { teamId, name } = action.payload;

      const team = state.teams.find((t) => t._id === teamId);

      if (team) {
        team.name = name;
      }
    },
    deleteTeam: (state, action: PayloadAction<{ teamId: string }>) => {
      const { teamId } = action.payload;

      state.teams = state.teams.filter((team) => {
        return team._id !== teamId;
      });
    },
  },
});

export const { setTeams, deleteTeam, addTeam, editTeamName } =
  teamsSlice.actions;

export default teamsSlice.reducer;
