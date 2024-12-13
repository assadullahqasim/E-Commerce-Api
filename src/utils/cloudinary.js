import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use async `fs` functions for non-blocking I/O

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_DB_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        console.error("File path is invalid or not provided.");
        return null;
    }

    try {
        // Ensure the file exists before uploading
        await fs.access(localFilePath);

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect file type
        });

        // Delete the local file
        await fs.unlink(localFilePath);

        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);

        // Attempt to delete the file if it exists
        try {
            await fs.unlink(localFilePath);
        } catch (unlinkError) {
            console.error("Error deleting local file:", unlinkError);
        }

        return null;
    }
};

export { uploadOnCloudinary };
