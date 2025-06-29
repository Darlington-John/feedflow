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

    deleteFeedback: (
      state,
      action: PayloadAction<{ feedbackId: string; userId: string }>
    ) => {
      const { feedbackId, userId } = action.payload;

      state.feedbacks = state.feedbacks.filter((feedback) => {
        return feedback._id !== feedbackId || feedback.by._id !== userId;
      });
    },

    addMoreFeedbacks: (state, action: PayloadAction<feedback_type[]>) => {
      state.feedbacks.push(...action.payload);
    },
  },
});

export const { setFeedbacks, addMoreFeedbacks, deleteFeedback, addFeedback } =
  feedbacksSlice.actions;

export default feedbacksSlice.reducer;
