import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || 8080,
  JWT_SECRET: process.env.JWT_SECRET,
  MAILERSEND_API_KEY: process.env.MAILERSEND_API_KEY,
  MONGO_URI: process.env.MONGO_URI,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

