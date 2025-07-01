import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { member_type } from "~/lib/types/member";

interface membersState {
  members: member_type[];
}
const initialState: membersState = {
  members: [],
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<member_type[]>) => {
      state.members = action.payload;
    },

    // removeMember: (
    //   state,
    //   action: PayloadAction<{ memberId: string; userId: string }>
    // ) => {
    //   const { memberId, userId } = action.payload;

    //   state.members = state.members.filter((member) => {
    //     return member._id !== memberId || member.by._id !== userId;
    //   });
    // },

    addMoreMembers: (state, action: PayloadAction<member_type[]>) => {
      state.members.push(...action.payload);
    },
  },
});

export const { setMembers, addMoreMembers } = membersSlice.actions;

export default membersSlice.reducer;
