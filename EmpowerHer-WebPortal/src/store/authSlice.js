import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    role: null,
    uid: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.uid = action.payload.uid;
        }, 
        logout: (state, action) => {
            state.isAuthenticated = false;
            state.role = null;
            state.uid = '';
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
