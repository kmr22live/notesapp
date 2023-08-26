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
    <>
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
              />
            </Col>
          );
        })}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
}

function NoteCard({ id, title, tags, markdown }: SimplifiedNote) {
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
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDeleteTag(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
