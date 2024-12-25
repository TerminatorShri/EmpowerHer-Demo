import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ForgotPasswordStage } from "../types/types";

interface ChangePasswordStateType {
  screenStage: ForgotPasswordStage;
  OTP: String[];
  email: String;
  newPassword: String;
  isLoading: boolean;
  isPasswordChanged: boolean;
  isOTPCorrect: boolean;
  error: string | null;
}

const initialState: ChangePasswordStateType = {
  screenStage: "mail",
  email: "",
  isLoading: false,
  OTP: ["", "", "", "", "", ""],
  newPassword: "",
  isPasswordChanged: false,
  isOTPCorrect: false,
  error: null,
};

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    setPasswordScreenStage(state, action: PayloadAction<ForgotPasswordStage>) {
      state.screenStage = action.payload;
    },
    setEmailForPasswordChange(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setPasswordChanged(state, action: PayloadAction<boolean>) {
      state.isPasswordChanged = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetPasswordState(state) {
      state.isLoading = false;
      state.isPasswordChanged = false;
      state.error = null;
    },
    setOTPStatus(state, action: PayloadAction<boolean>) {
      state.isOTPCorrect = action.payload;
    },
    setNewPassword(state, action: PayloadAction<string>) {
      state.newPassword = action.payload;
    },
  },
});

export const {
  setPasswordScreenStage,
  setEmailForPasswordChange,
  setLoading,
  setError,
  resetPasswordState,
  setOTPStatus,
  setNewPassword,
} = changePasswordSlice.actions;

export default changePasswordSlice.reducer;
