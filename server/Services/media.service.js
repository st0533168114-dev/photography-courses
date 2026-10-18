import { v2 as cloudinary } from "cloudinary";

// ההקטנה וסוגי הקבצים מוגדרים ב-preset בחשבון Cloudinary, ונאכפים שם ולא בדפדפן
const UPLOAD_PRESET = "site_images";
const ALLOWED_FOLDERS = ["photography-courses/courses", "photography-courses/home"];

export const signUpload = (paramsToSign) => {
  if (
    paramsToSign?.upload_preset !== UPLOAD_PRESET ||
    !ALLOWED_FOLDERS.includes(paramsToSign.folder)
  ) {
    return null;
  }
  return cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret);
};

export const isCloudinaryUrl = (url) =>
  typeof url === "string" &&
  url.startsWith(`https://res.cloudinary.com/${cloudinary.config().cloud_name}/`);
