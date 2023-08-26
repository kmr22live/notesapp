import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "../App";

// type SimplifiedNote = {
//   id: string;
//   tagIds?: string[];
//   tags: Tag[];
//   title?: string;
// };
type SimplifiedNote = {
  tags: Tag[];
  title: string | undefined;
  id: string;
  markdown?: string;
  image?: string | null;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

type EditTagsModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);
  console.log("reduxnotes", notes);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note?.title?.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  console.log("select", selectedTags);

  return (
    <div id="app">
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack
            gap={2}
            direction="horizontal"
            className="justify-content-center align-self-center"
          >
            <Link to="/new" className="text-decoration-none">
              {/* <Button variant="primary">Create</Button> */}
              <Form
                onClick={() => {
                  console.log("haoasdfasd");
                }}
              >
                <Form.Group controlId="formGroupEmail">
                  <Form.Control
                    type="text"
                    className="shadow-none border-focus"
                    placeholder="Take a note..."
                  />
                </Form.Group>
              </Form>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow-none border-focus"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                className="border-focus"
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
              {/* <ReactSelect
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(e: any) => {
                  setSelectedTags([{ id: e.value, label: e.label }]);
                }}
              /> */}
            </Form.Group>
          </Col>
        </Row>
      </Form>
      {filteredNotes.length < 1 ? (
        <div>
          <div className="text-center h5">Welcome to our Notes Taking App!</div>
          <div className="p-2">
            Here's how you can get started:
            <br /> <strong>1. Create a New Note:- </strong>Click on the "Take a
            Note" to create a new note. - Enter a title for your note in the
            designated field. - Write down your notes in the text area provided.
            - You can also add tags to categorize your notes by clicking on the
            "Tags" .
            <br /> <strong>2. Edit and Manage Notes: - </strong>To edit an
            existing note, click on the note's title or content. - Edit the
            note's title or content as needed and save your changes. - You can
            also delete a note by clicking on the "Delete" button.
            <br /> <strong>3. Tag Management: - </strong>Click on the "Edit
            Tags" button to manage your tags. - Rename or delete existing tags,
            and add new ones to help organize your notes.
            <br /> <strong>4. Search and Filter: - </strong>Use the search title
            to quickly find notes and tags. - Filter your notes by selecting
            specific tags to narrow down your search tag.
            <br /> <strong>5. Account and Sign Out: - </strong>If you have an
            account, you'll see your email displayed in the top right corner. -
            To sign out, simply click on the "Sign Out" button. We hope you find
            our app helpful for keeping your notes organized.
            <br /> If you have any questions or need assistance, feel free to
            reach out to our support team.
            <br /> <strong>Happy note-taking!</strong>
          </div>
        </div>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
          {filteredNotes.map((note) => {
            console.log(note);
            return (
              <Col key={note.id}>
                <NoteCard
                  id={note.id}
                  title={note.title}
                  tags={note.tags}
                  markdown={note.markdown}
                  image={note.image}
                />
              </Col>
            );
          })}
        </Row>
      )}
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </div>
  );
}

function NoteCard({ id, title, tags, markdown, image }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none card-effect
      `}
    >
      {tags.length > 0 && (
        <Stack gap={1} direction="horizontal" className="m-2 flex-wrap">
          {tags.map((tag) => (
            <Badge className="text-truncate" key={tag.id}>
              {tag.label}
            </Badge>
          ))}
        </Stack>
      )}
      {image && (
        <div className="d-flex justify-content-center align-items-center mb-2">
          <Card.Img variant="top" style={{ maxWidth: "250px" }} src={image} />
        </div>
      )}
      <Card.Body>
        <Stack gap={2} className="h-100">
          <span className="h3">{title}</span>
          <p className="">
            {markdown?.slice(0, 150)}
            {markdown && markdown.length > 150 ? "..." : ""}
          </p>
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.length < 1 ? (
              <div className="text-center">No tags available</div>
            ) : (
              availableTags.map((tag) => (
                <Row key={tag.id}>
                  <Col>
                    <Form.Control
                      type="text"
                      value={tag.label}
                      className="shadow-none border-focus"
                      onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      onClick={() => onDeleteTag(tag.id)}
                      variant="outline-danger"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              ))
            )}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
