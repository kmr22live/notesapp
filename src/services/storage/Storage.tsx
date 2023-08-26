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
