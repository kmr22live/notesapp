import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { NewNote } from "./components/NewNote";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./components/NoteList";
import { NoteLayout } from "./components/NoteLayout";
import { Note } from "./components/Note";
import { EditNote } from "./components/EditNote";
import { useAppDispatch } from "./store/Store";
import {
  addToNotes,
  addToTags,
  deleteNotes,
  deleteTags,
  selectNotesData,
  selectTagsData,
  updateNotes,
  updateTags,
} from "./store/NotesSlice";
import { useSelector } from "react-redux";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { selectAuthTokenData } from "./store/AuthSlice";
import { getUserData } from "./services/storage/Storage";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
  image?: string | null;
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const dispatch = useAppDispatch();
  const notesReduxData = useSelector(selectNotesData);
  const tagsReduxData = useSelector(selectTagsData);
  const AuthTokenData = useSelector(selectAuthTokenData);
  const nav = useNavigate();

  useEffect(() => {
    const getdata = getUserData();
    if (getdata === null) {
      nav("/login");
    }
  }, []);

  const notesWithTags = useMemo(() => {
    return notesReduxData.map((note) => {
      return {
        ...note,
        // tags: tagsReduxData.filter((tag) => tag),
        tags: tagsReduxData.filter((tag) => note.tagIds?.includes(tag.id)),
      };
    });
  }, [notesReduxData, tagsReduxData]);

  function onCreateNote({ tags, ...data }: NoteData) {
    dispatch(
      addToNotes({ ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) })
    );
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    dispatch(
      updateNotes({
        id: id,
        ...data,
        tagIds: tags.map((tag) => tag.id),
      })
    );
  }

  function onDeleteNote(id: string) {
    dispatch(deleteNotes(id));
  }

  function addTag(id: string, label: string, tag?: Tag) {
    dispatch(addToTags({ id: id, label: label }));
  }

  function updateTag(id: string, label: string) {
    dispatch(updateTags({ id: id, label: label }));
  }

  function deleteTag(id: string) {
    dispatch(deleteTags(id));
  }

  // const isOnline = navigator.onLine;
  // console.log("isonline", isOnline);

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tagsReduxData}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote onSubmit={onCreateNote} availableTags={tagsReduxData} />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote onSubmit={onUpdateNote} availableTags={tagsReduxData} />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Container>
  );
}

export default App;
