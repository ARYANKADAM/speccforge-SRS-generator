import mongoose from "mongoose";

const FeatureSchema = new mongoose.Schema({
  name: String,
  description: String,
  requirements: String,
});

const CollaboratorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, lowercase: true, trim: true },
    name: { type: String, trim: true },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acceptedAt: { type: Date },
  },
  { _id: false, timestamps: true }
);

const SRSFormSchema = new mongoose.Schema(
  {
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    projectName: { type: String, required: true },
    purpose: String,
    scope: String,
    definitions: String,
    references: String,
    productPerspective: String,
    productFunctions: String,
    userClasses: String,
    operatingEnvironment: String,
    constraints: String,
    userDocumentation: String,
    assumptions: String,
    features: [FeatureSchema],
    userInterfaces: String,
    hardwareInterfaces: String,
    softwareInterfaces: String,
    communicationInterfaces: String,
    performance: String,
    security: String,
    reliability: String,
    maintainability: String,
    usability: String,
    portability: String,
    businessRules: String,
    legalCompliance: String,
    standardsCompliance: String,
    glossary: String,
    notes: String,
    markdown: { type: String }, // Generated markdown content
    cloudinaryUrl: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          // Return true for null/undefined values to make the field optional
          if (!v) return true;
          // Simple URL validation
          return /^https?:\/\/.+/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }, // Cloudinary file link
    pdfUrl: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          // Return true for null/undefined values to make the field optional
          if (!v) return true;
          // Simple URL validation
          return /^https?:\/\/.+/.test(v);
        },
        message: props => `${props.value} is not a valid PDF URL!`
      }
    }, // PDF file link
    collaborators: {
      type: [CollaboratorSchema],
      default: [],
    },
    collaboration: {
      maxEditors: { type: Number, default: 4, min: 1, max: 20 },
    },
  },
  { timestamps: true }
);

SRSFormSchema.index({ createdBy: 1, createdAt: -1 });
SRSFormSchema.index({ "collaborators.userId": 1, createdAt: -1 });

// Clear the model if it exists to ensure schema changes are applied
// This is important for development when schema changes frequently
mongoose.models = {};

export default mongoose.models.SRSForm || mongoose.model("SRSForm", SRSFormSchema);
