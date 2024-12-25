import { PRESET_NAME, CLOUD_NAME } from "@env";

export const uploadImageToCloudinary = async (
  imageUri: string
): Promise<string> => {
  try {
    const data = new FormData();
    data.append("file", imageUri); 
    data.append("upload_preset", PRESET_NAME);

    console.log(PRESET_NAME, CLOUD_NAME);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error(
        `Cloudinary upload failed: ${cloudinaryResponse.statusText}`
      );
    }

    const result = await cloudinaryResponse.json();
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};
