import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScreenState } from "../types/types";

interface ScreenStateType {
  isLoggedIn: boolean;
  isEmergency: boolean;
  isChatbot: boolean;
  currentScreen: ScreenState;
}

const initialState: ScreenStateType = {
  isLoggedIn: false,
  isEmergency: false,
  isChatbot: false,
  currentScreen: "onboarding",
};

const screenSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setCurrentScreen(state, action: PayloadAction<ScreenState>) {
      state.currentScreen = action.payload;
    },
    setEmergencyState(state, action: PayloadAction<boolean>) {
      state.isEmergency = action.payload;
    },
    setChatBotScreenState(state, action: PayloadAction<boolean>) {
      state.isChatbot = action.payload;
    },
  },
});

export const {
  setIsLoggedIn,
  setCurrentScreen,
  setEmergencyState,
  setChatBotScreenState,
} = screenSlice.actions;
export default screenSlice.reducer;
