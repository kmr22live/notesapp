import { createSelector, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";

export type NotesData = {
  id: string;
  title: string;
  markdown?: string;
  tagIds?: string[];
  image?: string | null;
};

export type TagsData = {
  id: string;
  label: string;
};

type NotesState = {
  notesApp: NotesData[];
  tagsApp: TagsData[];
};

const initialState: NotesState = {
  notesApp: [],
  tagsApp: [],
};

export const NotesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addToNotes: (state, action: PayloadAction<NotesData>) => {
      state.notesApp = [...state.notesApp, action.payload];
    },
    updateNotes: (state, action: PayloadAction<NotesData>) => {
      state.notesApp = state.notesApp.map((note) => {
        if (note.id === action.payload.id) {
          return {
            ...note,
            ...action.payload,
          };
        } else {
          return note;
        }
      });
    },
    addToTags: (state, action: PayloadAction<TagsData>) => {
      state.tagsApp = [...state.tagsApp, action.payload];
    },
    updateTags: (state, action: PayloadAction<TagsData>) => {
      state.tagsApp = state.tagsApp.map((tag) => {
        if (tag.id === action.payload.id) {
          return { ...tag, label: action.payload.label };
        } else {
          return tag;
        }
      });
    },
    deleteTags: (state, action: PayloadAction<string>) => {
      state.tagsApp = state.tagsApp.filter(
        (note) => note.id !== action.payload
      );
    },

    deleteNotes: (state, action: PayloadAction<string>) => {
      state.notesApp = state.notesApp.filter(
        (note) => note.id !== action.payload
      );
    },
  },
});

// Define a base selector to get the entire notesApp state
const selectNotesApp = (state: RootState) => state.notes.notesApp;
const selectTagsApp = (state: RootState) => state.notes.tagsApp;

// Create a selector to get the notesData array
export const selectNotesData = createSelector(
  selectNotesApp,
  (notesApp) => notesApp
);
export const selectTagsData = createSelector(
  selectTagsApp,
  (tagsApp) => tagsApp
);

export default NotesSlice;
export const {
  addToNotes,
  addToTags,
  deleteNotes,
  updateNotes,
  updateTags,
  deleteTags,
} = NotesSlice.actions;
