import { SecurityScreenType } from "../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SecurityScreenContext {
  currentFeature: SecurityScreenType;
  isSafetyTimerEnabled: boolean;
  safetyTimerTimeInterval: number[];
  SOSButtonContacts: string[];
  safetyTimerContacts: string[];
}

const initialState: SecurityScreenContext = {
  currentFeature: "features",
  isSafetyTimerEnabled: false,
  safetyTimerTimeInterval: [0, 15],
  SOSButtonContacts: ["", "", ""],
  safetyTimerContacts: ["", "", ""],
};

const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {
    setCurrentFeature(state, action: PayloadAction<SecurityScreenType>) {
      state.currentFeature = action.payload;
    },
    setSafetyTimerState(state) {
      state.isSafetyTimerEnabled = !state.isSafetyTimerEnabled;
    },
    updateSafetyTimerTimeInterval(state, action: PayloadAction<number[]>) {
      state.safetyTimerTimeInterval = action.payload;
    },
    setSOSButtonContacts(state, action: PayloadAction<string[]>) {
      state.SOSButtonContacts = action.payload;
    },
    setSafetyTimerContacts(state, action: PayloadAction<string[]>) {
      state.safetyTimerContacts = action.payload;
    },
  },
});

export const {
  setCurrentFeature,
  setSafetyTimerState,
  updateSafetyTimerTimeInterval,
  setSOSButtonContacts,
  setSafetyTimerContacts,
} = securitySlice.actions;
export default securitySlice.reducer;
