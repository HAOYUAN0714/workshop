import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface userSettings {
    theme: string;
}

const initialState: userSettings = {
    theme: localStorage.getItem('theme') || '',
};

export const userSettingSlice = createSlice({
    name: 'userSetting',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            localStorage.setItem('theme', action.payload);
            state.theme = action.payload;
        },
    },
})

export const { setTheme } = userSettingSlice.actions;

export const theme = (state: RootState) => state.userSettingSlice.theme;

export default userSettingSlice.reducer;