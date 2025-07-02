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

    removeMember: (state, action: PayloadAction<{ memberId: string }>) => {
      const { memberId } = action.payload;

      // Remove the member completely
      state.members = state.members.filter((member) => member._id !== memberId);

      // Remove the memberId from all adminIds lists
      state.members = state.members.map((member) => ({
        ...member,
        adminIds: member.adminIds.filter((id) => id !== memberId),
      }));
    },
    upgradeMember: (state, action: PayloadAction<{ memberId: string }>) => {
      const { memberId } = action.payload;

      state.members = state.members.map((member) => {
        if (member._id === memberId) {
          if (!member.adminIds.includes(member._id)) {
            member.adminIds.push(member._id);
            member.role = "admin";
          }
        }
        return member;
      });
    },
    downgradeMember: (state, action: PayloadAction<{ memberId: string }>) => {
      const { memberId } = action.payload;

      state.members = state.members.map((member) => {
        if (member._id === memberId) {
          if (member.adminIds.includes(member._id)) {
            member.adminIds = member.adminIds.filter((id) => id !== member._id);
            member.role = "member";
          }
        }
        return member;
      });
    },
    addMoreMembers: (state, action: PayloadAction<member_type[]>) => {
      state.members.push(...action.payload);
    },
  },
});

export const { setMembers, addMoreMembers, upgradeMember, downgradeMember } =
  membersSlice.actions;

export default membersSlice.reducer;
