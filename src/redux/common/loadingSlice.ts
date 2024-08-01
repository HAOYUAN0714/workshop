import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface loadingQueueInterface {
    [key: string]: boolean;
}

const initialState = {
    loadingQueue: {} as loadingQueueInterface,
};

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        addLoading: (state, action: PayloadAction<string>) => {
            state.loadingQueue[action.payload] = true;
        },
        removeLoading: (state, action: PayloadAction<string>) => {
            delete state.loadingQueue[action.payload];
        }
    },
});

export const { addLoading, removeLoading } = loadingSlice.actions;

export const isFullLoading = (state: RootState) => !!Object.keys(state.loadingSlice.loadingQueue).length;

export default loadingSlice.reducer;