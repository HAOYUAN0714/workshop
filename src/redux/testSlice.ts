import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';


interface TestItem {
    id: string;
    content: string;
}

export interface TestState {
    testList: TestItem[];
    testNumber: number;
    testObj: {
        name: string;
        age: number;
        birth?: string;
    };

}

const initialState: TestState = {
    testList: [],
    testNumber: 0,
    testObj: {
        name: '',
        age: 0,
    }
};

export const testSlice = createSlice({
    name: 'testSlice',
    initialState,
    reducers: {
        setTestList: (state, action: PayloadAction<TestItem[]>) => {
            state.testList = action.payload;
        },
        setTestNumber: (state, action: PayloadAction<number>) => {
            state.testNumber = action.payload;
        },
        setTestObj: (state, action: PayloadAction<TestState['testObj']>) => {
            state.testObj = action.payload;
        },
    },
})

export const { setTestList, setTestNumber, setTestObj } = testSlice.actions;

export const selectTestList = (state: RootState) => state.testSlice.testList;

export default testSlice.reducer;