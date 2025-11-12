import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS URLs
  timeout: 120000, // 2 minutes timeout
});

// Upload PDF to Cloudinary
export async function uploadPDFToCloudinary(pdfBuffer, fileName = "srs-document") {
  try {
    console.log("Starting Cloudinary PDF upload for:", fileName);
    
    // Use Promise to handle the upload_stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Changed from "raw" to "auto"
          public_id: `${fileName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          folder: "srs-documents-pdf",
          type: "upload", // Use 'upload' type (public by default)
          access_mode: "public", // Explicitly set to public
          flags: "attachment:food-delivery-app.pdf", // Set download filename
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary PDF upload error:", error);
            reject(error);
            return;
          }
          console.log("Cloudinary PDF upload complete. URL:", result.secure_url);
          resolve(result.secure_url);
        }
      );
      
      // Write the buffer to the upload stream
      uploadStream.write(pdfBuffer);
      uploadStream.end();
    });
  } catch (error) {
    console.error("Error in uploadPDFToCloudinary:", error);
    throw error;
  }
}
