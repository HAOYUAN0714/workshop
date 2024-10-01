import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface alertInfo {
    id: string
    title?: string,
    message: string;
    alertType: string;
}

interface stateInterface {
    alertInfoArray: Array<alertInfo>
}

const initialState: stateInterface = {
    alertInfoArray: []
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<alertInfo>) => {
            state.alertInfoArray.push(action.payload)
        },
        removeAlert: (state, action: PayloadAction<string>) => {
            state.alertInfoArray = state.alertInfoArray.filter((alert) => alert.id !== action.payload)
        }
    }
})

export const { addAlert, removeAlert } = alertSlice.actions

export const alertInfoArray = (state: RootState) => state.alertSlice.alertInfoArray

export default alertSlice.reducer
