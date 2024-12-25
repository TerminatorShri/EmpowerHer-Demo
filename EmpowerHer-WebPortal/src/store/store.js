import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js';
import emergencyReducer from './emergencySlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        emergency: emergencyReducer,
    },
});

export default store;