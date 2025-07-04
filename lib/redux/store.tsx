import { configureStore } from "@reduxjs/toolkit";
import feedbacksReducer from "./slices/feedbacks";
import membersReducer from "./slices/members";
import userFeedbackReducer from "./slices/user-feedbacks";
import teamReducer from "./slices/teams";
export const store = configureStore({
  reducer: {
    feedbacks: feedbacksReducer,
    members: membersReducer,
    user_feedbacks: userFeedbackReducer,
    teams: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
