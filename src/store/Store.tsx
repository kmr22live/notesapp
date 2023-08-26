import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import NotesSlice from "./NotesSlice";
import AuthSlice from "./AuthSlice";

// Load data from local storage
const persistedState = localStorage.getItem("notesappuuid_notes")
  ? JSON.parse(localStorage.getItem("notesappuuid_notes")!)
  : {};

export const store = configureStore({
  reducer: {
    notes: NotesSlice.reducer,
    auth: AuthSlice.reducer,
  },
  preloadedState: persistedState,
});

// Subscribe to store updates and save state to local storage
store.subscribe(() => {
  localStorage.setItem("notesappuuid_notes", JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
