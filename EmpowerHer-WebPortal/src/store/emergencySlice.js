import { createSlice } from '@reduxjs/toolkit';

const emergencySlice = createSlice({
  name: 'map',
  initialState: {
    location: "https://www.google.com/maps/place/Kolhapur,+Maharashtra/@16.7086167,74.1564651,12z/data=!3m1!4b1!4m6!3m5!1s0x3bc1000cdec07a29:0xece8ea642952e42f!8m2!3d16.7049873!4d74.2432527!16zL20vMDF4cG4y?entry=ttu&g_ep=EgoyMDI0MTEwNi4wIKXMDSoASAFQAw%3D%3D",  
    error: null,
    uid: '',
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;  
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLocation, setError } = emergencySlice.actions;

export default emergencySlice.reducer;
