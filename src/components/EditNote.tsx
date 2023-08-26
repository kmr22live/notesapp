import { NoteData, Tag } from "../App";
import { NoteForm } from "./NoteForm";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  // onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function EditNote({ onSubmit, availableTags }: EditNoteProps) {
  const note = useNote();
  console.log("note", note);
  return (
    <div id="edit-hover">
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        image={note.image}
        onSubmit={(data) => onSubmit(note.id, data)}
        // onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </div>
  );
}
