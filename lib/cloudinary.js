import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 2 minutes timeout
});

// Upload markdown to Cloudinary
export async function uploadMarkdownToCloudinary(markdown, fileName = "srs-document") {
  try {
    console.log("Starting Cloudinary upload for:", fileName);
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key_partial: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 4) + "..." : "missing",
    });
    
    // Create a data URI from the markdown text
    const dataUri = `data:text/markdown;base64,${Buffer.from(markdown).toString('base64')}`;
    
    // Use Promise to handle the upload_stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          format: "md",
          public_id: `${fileName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          folder: "srs-documents",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary stream upload error:", error);
            reject(error);
            return;
          }
          console.log("Cloudinary upload complete. URL:", result.secure_url);
          resolve(result.secure_url);
        }
      );
      
      // Convert the base64 part of the data URI to a buffer
      const base64Data = dataUri.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Write the buffer to the upload stream
      uploadStream.write(buffer);
      uploadStream.end();
    });
  } catch (error) {
    console.error("Error in uploadMarkdownToCloudinary:", error);
    throw error;
  }
}