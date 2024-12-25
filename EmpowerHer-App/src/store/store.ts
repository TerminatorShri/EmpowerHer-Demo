import { configureStore } from "@reduxjs/toolkit";
import screenReducer from "../contexts/screenSlice";
import changePasswordReducer from "../contexts/changePasswordSlice";
import securityScreenReducer from "../contexts/securityFeatureSlice";
import userReducer from "../contexts/userSlice";

export const store = configureStore({
  reducer: {
    screen: screenReducer,
    changePassword: changePasswordReducer,
    securityFeature: securityScreenReducer,
    appUser: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
