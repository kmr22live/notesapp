export const storeUserData = (data: string): void => {
  localStorage.setItem("notesappuuid", data);
};

export const getUserData = (): string | null => {
  return localStorage.getItem("notesappuuid");
};

export const removeUserData = (): void => {
  localStorage.removeItem("notesappuuid");
};

export const storeUserData = (data: string): void => {
  localStorage.setItem("notesappuuid", data);
};

export const getUserData = (): string | null => {
  console.log("localdata", localStorage.getItem("notesappuuid"));
  return localStorage.getItem("notesappuuid");
};

export const removeUserData = (): void => {
  localStorage.removeItem("notesappuuid");
};

export type NotesData = {
  id: string;
  title: string;
  markdown?: string;
  tagIds?: string[];
  image?: string | null;
};

export const setNotesDataLocal = (data: any): void => {
  localStorage.setItem("notesappuuid_notes", JSON.stringify(data));
};

export const getNotesDataLocal = (): NotesData[] => {
  const notesLocalData = localStorage.getItem("notesappuuid_notes");
  return notesLocalData !== null ? JSON.parse(notesLocalData) : [];
};
export const setTagsDataLocal = (data: string): void => {
  localStorage.setItem("notesappuuid_tags", JSON.stringify(data));
};

export const getTagsDataLocal = (): NotesData[] => {
  const notesLocalData = localStorage.getItem("notesappuuid_tags");
  return notesLocalData !== null ? JSON.parse(notesLocalData) : [];
};
