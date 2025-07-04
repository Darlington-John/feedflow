import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { feedback_type } from "~/lib/types/feedback";

interface feedbacksState {
  feedbacks: feedback_type[];
}
const initialState: feedbacksState = {
  feedbacks: [],
};

const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {
    setFeedbacks: (state, action: PayloadAction<feedback_type[]>) => {
      state.feedbacks = action.payload;
    },
    addFeedback: (state, action: PayloadAction<feedback_type>) => {
      const newFeedback = action.payload;
      state.feedbacks.unshift(newFeedback);
    },

    deleteFeedback: (state, action: PayloadAction<{ feedbackId: string }>) => {
      const { feedbackId } = action.payload;

      state.feedbacks = state.feedbacks.filter((feedback) => {
        return feedback._id !== feedbackId;
      });
    },
    markFeedback: (
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

      const feedback = state.feedbacks.find((f) => f._id === feedbackId);

      if (feedback) {
        feedback.status = {
          type: status,
          marked_by: user,
          marked_at: new Date().toISOString(),
        };
      }
    },

    addMoreFeedbacks: (state, action: PayloadAction<feedback_type[]>) => {
      state.feedbacks.push(...action.payload);
    },
  },
});

export const {
  setFeedbacks,
  addMoreFeedbacks,
  deleteFeedback,
  addFeedback,
  markFeedback,
} = feedbacksSlice.actions;

export default feedbacksSlice.reducer;
