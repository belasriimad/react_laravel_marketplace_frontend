import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

const initialState = {
    cartItems: []
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const item = action.payload
            const exists = state.cartItems.find(picture => picture.id === item.id)
            //check if picture already exists in the cart
            //if exists we tell the user that the picture already in the cart
            //if not we add the picture to the cart
            if(exists) {
                toast.info('Picture already in your cart.', {
                    position: toast.POSITION.TOP_RIGHT
                })
            }else {
                state.cartItems = [item, ...state.cartItems]
                toast.success('Picture added to the cart.', {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        },
        removeFromCart(state, action) {
            const item = action.payload
            state.cartItems = state.cartItems.filter(picture => picture.id !== item.id)
            toast.info('Picture removed from the cart.', {
                position: toast.POSITION.TOP_RIGHT
            })
        },
        clearCartItems(state, action){
            state.cartItems = []
        }
    }
})

const cartReducer = cartSlice.reducer

export const { addToCart, removeFromCart, clearCartItems} = cartSlice.actions

export default cartReducer