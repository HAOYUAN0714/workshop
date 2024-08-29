import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Cart as CartInfoInterface }  from '@/interface/base/carts';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartData: {} as CartInfoInterface,
    },
    reducers: {
        updateCart: (state, action: PayloadAction<CartInfoInterface>) => {
            state.cartData = action.payload;
        },
        clearCart: (state) => {
            state.cartData = {} as CartInfoInterface;
        }
    },
})

export const { updateCart, clearCart } = cartSlice.actions;

export const cartData = (state: RootState) => state.cartSlice.cartData;

export default cartSlice.reducer;
