import { FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";
import { addToTags } from "../store/NotesSlice";
import { useAppDispatch } from "../store/Store";
import { app } from "../services/Auth/Auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
  image,
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const imageSrc = image || undefined;

  /**
   *
   * @returns handleImageUpload is image upload function to firebase storage
   */
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const storageRef = ref(getStorage(app), `images/${selectedImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      async () => {
        const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(imageUrl);
      }
    );
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    handleImageUpload();
  }, [selectedImage]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
      image: imageUrl,
    });

    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                className="shadow-none border-focus"
                ref={titleRef}
                required
                defaultValue={title}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                className="select-tags"
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };

                  dispatch(addToTags(newTag));
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
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
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>

          <Form.Control
            className="shadow-none border-focus"
            defaultValue={markdown}
            required
            as="textarea"
            ref={markdownRef}
            rows={15}
          />
        </Form.Group>
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {uploadProgress > 0 && (
            <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
          )}
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded" />
          ) : (
            imageSrc !== undefined && (
              <img
                src={imageSrc}
                className="d-block image-posted"
                alt="image"
              />
            )
          )}
        </div>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="dark">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}
