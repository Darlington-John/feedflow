import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // comments: commentReducer,
    // communities: communitiesReducer,
    // recent_communities: recent_CommunitiesReducer,
    // user_posts: user_PostsReducer,
    // user_comments: user_CommentsReducer,
    // user_saved_posts: user_SavedPostsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
