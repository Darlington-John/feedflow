import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { feedback_type } from "~/lib/types/feedback";

interface UserFeedbacksState {
  userFeedbacks: feedback_type[];
}
const initialState: UserFeedbacksState = {
  userFeedbacks: [],
};

const userFeedbacksSlice = createSlice({
  name: "userFeedbacks",
  initialState,
  reducers: {
    setUserFeedbacks: (state, action: PayloadAction<feedback_type[]>) => {
      state.userFeedbacks = action.payload;
    },
    addUserFeedback: (state, action: PayloadAction<feedback_type>) => {
      const newFeedback = action.payload;
      state.userFeedbacks.unshift(newFeedback);
    },

    deleteUserFeedback: (
      state,
      action: PayloadAction<{ feedbackId: string }>
    ) => {
      const { feedbackId } = action.payload;

      state.userFeedbacks = state.userFeedbacks.filter((feedback) => {
        return feedback._id !== feedbackId;
      });
    },
    markUserFeedback: (
      state,
      action: PayloadAction<{
        feedbackId: string;
        status: string;
        user: {
          _id: string;
          username: string;
          profile: string;
        };
      }>
    ) => {
      const { feedbackId, status, user } = action.payload;

      const feedback = state.userFeedbacks.find((f) => f._id === feedbackId);

      if (feedback) {
        feedback.status = {
          type: status,
          marked_by: user,
          marked_at: new Date().toISOString(),
        };
      }
    },
    addMoreUserFeedbacks: (state, action: PayloadAction<feedback_type[]>) => {
      state.userFeedbacks.push(...action.payload);
    },
  },
});

export const {
  setUserFeedbacks,
  addMoreUserFeedbacks,
  deleteUserFeedback,
  addUserFeedback,
  markUserFeedback,
} = userFeedbacksSlice.actions;

export default userFeedbacksSlice.reducer;
