import React, { useState } from "react";
import { app } from "../services/Auth/Auth"; // Import your Firebase configuration
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const storageRef = ref(getStorage(app), `images/${selectedImage.name}`);
    await uploadBytes(storageRef, selectedImage);

    const imageUrl = await getDownloadURL(storageRef);
    setImageUrl(imageUrl);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
      {uploadProgress > 0 && (
        <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
      )}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default ImageUpload;
