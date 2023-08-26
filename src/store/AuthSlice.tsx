import { createSelector } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import { getUserData, removeUserData } from "../services/storage/Storage";

type Authstate = {
  isLoggIn: boolean;
  authToken: boolean | null;
};

const initialState: Authstate = {
  isLoggIn: false,
  authToken: getUserData() !== null ? true : false,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggIn = getUserData() !== null ? true : false;
      state.authToken = getUserData() !== null ? true : false;
    },
    logout: (state) => {
      state.isLoggIn = false;
      removeUserData();
      state.authToken = null;
    },
  },
});

// Define a base selector to get the entire notesApp state
const selectIsLoggin = (state: RootState) => state.auth.isLoggIn;
const selectAuthToken = (state: RootState) => state.auth.isLoggIn;

// Create a selector to get the notesData array
export const selectIsLogginData = createSelector(
  selectIsLoggin,
  (isLoggIn) => isLoggIn
);
export const selectAuthTokenData = createSelector(
  selectAuthToken,
  (authToken) => authToken
);

export default AuthSlice;
export const { login, logout } = AuthSlice.actions;
