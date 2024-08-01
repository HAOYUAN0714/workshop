import { configureStore } from '@reduxjs/toolkit';
import userSettingSlice from './common/userSettingSlice';
import alertSlice from './common/alertSlice';
import loadingSlice from './common/loadingSlice';

export const store = configureStore({
    reducer: {
        userSettingSlice,
        alertSlice,
        loadingSlice
    }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
