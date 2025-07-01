import { configureStore } from "@reduxjs/toolkit";
import feedbacksReducer from "./slices/feedbacks";
import membersReducer from "./slices/members";
export const store = configureStore({
  reducer: {
    feedbacks: feedbacksReducer,
    members: membersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
