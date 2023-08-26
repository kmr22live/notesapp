import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
// import { Note } from "../App";

export type Tag = {
  id: string;
  label: string;
};
export type Note = {
  tags: any[];
  id: string;
  title: string;
  markdown?: string | undefined;
  tagIds?: string[] | undefined;
};
type NoteLayoutProps = {
  notes: Note[];
};

export function NoteLayout({ notes }: NoteLayoutProps) {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (note == null) return <Navigate to="/" replace />;

  return <Outlet context={note} />;
}

export function useNote() {
  return useOutletContext<Note>();
}
