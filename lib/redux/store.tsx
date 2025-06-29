import { configureStore } from "@reduxjs/toolkit";
import feedbacksReducer from "./slices/feedbacks";
export const store = configureStore({
  reducer: {
    feedbacks: feedbacksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
