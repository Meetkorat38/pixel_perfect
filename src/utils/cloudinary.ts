import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload file to cloudinary and remove local temp file
export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const res = await cloudinary.uploader.upload(localFilePath, {
      folder: "ecommerce-products",
      resource_type: "image",
    });

    // remove local file
    fs.unlinkSync(localFilePath);

    return res.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    fs.unlinkSync(localFilePath); // cleanup
    return null;
  }
};
